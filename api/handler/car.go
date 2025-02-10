package handler

import (
	"api/json_util"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type Car struct {
	VIN              string    `json:"vin"`
	Name             string    `json:"name"`
	Price            float64   `json:"price"`
	DateOfInsert     time.Time `json:"date_of_insert"`
	Odometer         int       `json:"odometer"`
	RegistrationDate string    `json:"registrationDate"`
	URL              string    `json:"url"`
}

type CarHandler struct {
	DB    *pgxpool.Pool
	cache *redis.Client
}

func Init(db *pgxpool.Pool, cache *redis.Client) *CarHandler {
	return &CarHandler{DB: db, cache: cache}
}

func (carHandler *CarHandler) GetCarByVIN(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	vin := r.PathValue("vin")

	cacheKey := fmt.Sprintf("car:%s", vin)
	val, err := carHandler.cache.Get(ctx, cacheKey).Result()

	if err == nil {
		var cachedCars []Car
		if err := json.Unmarshal([]byte(val), &cachedCars); err == nil {
			json_util.WriteJSON(w, 200, cachedCars)
			return
		}
	} else if err != redis.Nil {

		json_util.WriteJSONError(w, fmt.Sprintf("Cache error: %v", err), http.StatusInternalServerError)
		return
	}

	query := `
	WITH price_changes AS (
		SELECT 
			vin,
			name,
			price,
			date_of_insert,
			odometer,
			registration_date,
			url,
			LAG(price) OVER (PARTITION BY vin ORDER BY date_of_insert) AS previous_price
		FROM "avto-cena".all_cars_materialized_view
		WHERE vin = $1
			)
	SELECT 
		vin,
		name,
		price,
		date_of_insert,
		odometer,
		registration_date,
		url
	FROM price_changes
	WHERE price != previous_price OR previous_price IS NULL
	ORDER BY date_of_insert DESC`

	rows, err := carHandler.DB.Query(ctx, query, vin)
	if err != nil {
		json_util.WriteJSONError(w, fmt.Sprintf("Query failed: %v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var cars []Car
	for rows.Next() {
		var car Car
		if err := rows.Scan(
			&car.VIN,
			&car.Name,
			&car.Price,
			&car.DateOfInsert,
			&car.Odometer,
			&car.RegistrationDate,
			&car.URL,
		); err != nil {
			json_util.WriteJSONError(w, fmt.Sprintf("Data parsing failed: %v", err), http.StatusInternalServerError)
			return
		}
		cars = append(cars, car)
	}

	jsonCars, _ := json.Marshal(cars)
	carHandler.cache.Set(ctx, cacheKey, jsonCars, time.Hour)

	json_util.WriteJSON(w, 200, cars)
}
