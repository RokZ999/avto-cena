package postgre

import (
	"context"
	"errors"
	"log/slog"
	"os"
	"sync"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Postgree struct {
	client *pgxpool.Pool
}

var (
	instance *Postgree
	once     sync.Once
	errInit  error

	ErrMissingConnectionString = errors.New("missing PostgreSQL connection string")
)

func Init() (*Postgree, error) {
	once.Do(func() {
		connString := os.Getenv("POSTGRE_DB_CONNECTION_STRING")
		if connString == "" {
			errInit = ErrMissingConnectionString
			return
		}

		dbpool, err := pgxpool.New(context.Background(), connString)
		if err != nil {
			slog.Error("Unable to create connection pool", "error", err)
			errInit = err
			return
		}

		if err := dbpool.Ping(context.Background()); err != nil {
			slog.Error("Unable to ping database", "error", err)
			dbpool.Close()
			errInit = err
			return
		}
		instance = &Postgree{client: dbpool}
	})

	return instance, errInit
}

func (p *Postgree) Close() {
	if p.client != nil {
		p.client.Close()
	}
}

func (p *Postgree) GetClient() *pgxpool.Pool {
	return p.client
}
