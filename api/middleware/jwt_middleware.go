package middleware

import (
	"api/json_util"
	"fmt"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt"
)

func IsAuthed(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {

			json_util.WriteJSONError(w, "Unauthorized - No token provided", http.StatusUnauthorized)
			return
		}

		if len(authHeader) < 7 || authHeader[:7] != "Bearer " {
			json_util.WriteJSONError(w, "Unauthorized - Invalid token format", http.StatusUnauthorized)
			return
		}

		tokenString := authHeader[7:]

		if tokenString == "" {
			json_util.WriteJSONError(w, "Unauthorized - No token provided", http.StatusUnauthorized)
			return
		}

		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			json_util.WriteJSONError(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secret), nil
		})

		if err != nil {
			json_util.WriteJSONError(w, "Unauthorized - Invalid token", http.StatusUnauthorized)
			return
		}

		if !token.Valid {
			json_util.WriteJSONError(w, "Unauthorized - Token expired", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
