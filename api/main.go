package main

import (
	"log/slog"
	"net/http"
	"os"

	"api/handler"
	"api/middleware"
	"api/postgre"
	"api/redis"

	"github.com/joho/godotenv"
)

func main() {
	loadEnvVariables()

	db := initializeDatabase()
	defer db.Close()

	cache := initCacheDatabase()

	router := setupRouter(db, cache)

	startServer(router)
}

func loadEnvVariables() {
	godotenv.Load()
	slog.Info("Environment variables loaded.")
}

func initializeDatabase() *postgre.Postgree {
	db, err := postgre.Init()
	if err != nil {
		slog.Error("Error initializing PostgreSQL", "error", err)
		os.Exit(1)
	}
	return db
}

func initCacheDatabase() *redis.Redis {
	cache, err := redis.Init()
	if err != nil {
		slog.Error("Error initializing Redis", "error", err)
		os.Exit(1)
	}
	return cache
}

func setupRouter(db *postgre.Postgree, cache *redis.Redis) http.Handler {
	carHandler := handler.Init(db.GetClient(), cache.GetClient())

	publicRouter := http.NewServeMux()

	debug_mode := os.Getenv("DEBUG_MODE")
	if debug_mode == "true" {
		publicRouter.HandleFunc("GET /debug/token", handler.GenerateJWT)

	}

	protectedRouter := http.NewServeMux()
	protectedRouter.HandleFunc("GET /carHistory/{vin}", carHandler.GetCarByVIN)

	stack := middleware.CreateStack(middleware.IsAuthed)

	mainRouter := http.NewServeMux()
	mainRouter.Handle("/", stack(protectedRouter))
	mainRouter.Handle("/debug/", publicRouter)

	return mainRouter
}

func startServer(handler http.Handler) {
	port := ":" + os.Getenv("GO_BACKEND_PORT")
	server := &http.Server{
		Addr:    port,
		Handler: handler,
	}

	slog.Info("Server running on port", "port", port)

	if err := server.ListenAndServe(); err != nil {
		slog.Error("Server failed", "error", err)
		os.Exit(1)
	}
}
