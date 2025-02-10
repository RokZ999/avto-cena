package json_util

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

func WriteJSONError(w http.ResponseWriter, msg string, statusCode int) {
	slog.Error("Request error", "error", msg, "status", statusCode)

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(statusCode)

	response := map[string]string{"error": msg}
	json.NewEncoder(w).Encode(response)
}

func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)

	encoder := json.NewEncoder(w)
	encoder.SetEscapeHTML(false)

	return encoder.Encode(v)
}
