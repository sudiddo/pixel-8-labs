package server

import (
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/pixel8labs/project-template/backend/handler/server"
	"github.com/pixel8labs/project-template/backend/pkg/errors"

	log "github.com/sirupsen/logrus"
)

func Run() {
	port := os.Getenv("PORT")
	if port == "" {
		panic("No PORT Set")
	}

	// signerConfig := config.LoadSigner()

	e := echo.New()

	// Middlewares
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type", "Content-Length", "Origin"},
		ExposeHeaders:    []string{"*"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60,
	}))
	e.HTTPErrorHandler = errors.Middleware

	log.SetFormatter(&log.JSONFormatter{})
	// Init Handler
	h := server.NewHandler()

	e.GET("/healthcheck", func(c echo.Context) error {
		return c.String(http.StatusOK, "OK")
	})

	// API Routes
	e.GET("/v1/sample", h.GetSample)

	e.Logger.Fatal(e.Start(":" + port))
}
