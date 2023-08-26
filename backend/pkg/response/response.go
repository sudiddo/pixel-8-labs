package response

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/pixel8labs/project-template/backend/entity"
)

func Ok[T any](c echo.Context, data T) error {
	return c.JSON(http.StatusOK, entity.OkResponse[T]{
		Status: "OK",
		Data:   data,
	})
}
