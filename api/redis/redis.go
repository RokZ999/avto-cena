package redis

import (
	"github.com/redis/go-redis/v9"
	"log/slog"
	"os"
)

type Redis struct {
	client *redis.Client
}

func Init() (*Redis, error) {
	con_string := os.Getenv("REDIS_CONNECTION_STRING")
	opt, err := redis.ParseURL(con_string)
	if err != nil {
		slog.Error("Unable to create connection pool", "error", err)
		return nil, err
	}
	client := &Redis{client: redis.NewClient(opt)}
	
	return client, nil
}

func (r *Redis) GetClient() *redis.Client {
	return r.client
}
