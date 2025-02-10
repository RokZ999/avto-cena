package handler

import (
	"api/json_util"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

func GenerateJWT(w http.ResponseWriter, r *http.Request) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		json_util.WriteJSONError(w, "JWT_SECRET not set on backend", http.StatusInternalServerError)
		return
	}

	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = time.Now().Add(24 * time.Hour).Unix()
	claims["iat"] = time.Now().Unix()

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return
	}

	response := map[string]any{
		"access_token": tokenString,
		"token_type":   "Bearer",
		"expires_in":   86400, // 24 hours in seconds
	}

	err = json_util.WriteJSON(w, 200, response)
}
