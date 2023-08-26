package server

import (
	"github.com/labstack/echo/v4"
	"github.com/pixel8labs/project-template/backend/pkg/response"
)

func (h *Handler) GetSample(c echo.Context) error {
	resp := map[string]interface{}{
		"success": true,
		"message": "Get sample success",
	}
	return response.Ok(c, resp)
}
