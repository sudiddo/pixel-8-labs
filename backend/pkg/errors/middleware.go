package errors

import (
	"net/http"

	stderr "errors"

	"github.com/labstack/echo/v4"
	"github.com/pixel8labs/project-template/backend/entity"
	log "github.com/sirupsen/logrus"
)

func Middleware(err error, c echo.Context) {
	// 400 Client Error
	var validationError *ValidationError
	if stderr.As(err, &validationError) {
		log.WithFields(log.Fields{
			"error":   validationError.Error(),
			"context": c.Get("context"),
		}).Error()
		c.JSON(http.StatusBadRequest, entity.ErrResponse{
			Status:    "VALIDATION_ERROR",
			ErrorCode: validationError.ErrorCode,
			Message:   validationError.Message,
		})
		return
	}

	// 401 Authorization Error
	var unauthorizedAccessError *UnauthorizedAccessError
	if stderr.As(err, &unauthorizedAccessError) {
		log.WithFields(log.Fields{
			"error":   unauthorizedAccessError.Error(),
			"context": c.Get("context"),
		}).Error()
		c.JSON(http.StatusUnauthorized, entity.ErrResponse{
			Status:    "UNAUTHORIZED",
			ErrorCode: unauthorizedAccessError.ErrorCode,
			Message:   unauthorizedAccessError.Message,
		})
		return
	}

	// 500 Internal Server Error
	var serverError *ServerError
	if stderr.As(err, &serverError) {
		log.WithFields(log.Fields{
			"error":   serverError.Error(),
			"context": c.Get("context"),
		}).Error()
		c.JSON(http.StatusInternalServerError, entity.ErrResponse{
			Status:    "INTERNAL_SERVER_ERROR",
			ErrorCode: serverError.ErrorCode,
			Message:   serverError.Message,
		})
		return
	}

	// 404 Not Found Error
	var notFoundError *NotFoundError
	if stderr.As(err, &notFoundError) {
		log.WithFields(log.Fields{
			"error":   notFoundError.Error(),
			"context": c.Get("context"),
		}).Error()
		c.JSON(http.StatusNotFound, entity.ErrResponse{
			Status:    "NOT_FOUND",
			ErrorCode: notFoundError.ErrorCode,
			Message:   notFoundError.Message,
		})
		return
	}

	// Unknown Error
	log.WithFields(log.Fields{
		"error":   err,
		"context": c.Get("context"),
	}).Error()
	c.JSON(http.StatusInternalServerError, entity.ErrResponse{
		Status:    "UNKNOWN_ERROR",
		ErrorCode: "UNKNOWN_ERROR",
		Message:   err.Error(),
	})
}
