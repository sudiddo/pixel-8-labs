package server

type Handler struct {
	// config goes here
	// e.g PostgreSQL, MongoDB, GCS, etc.
}

func NewHandler() *Handler {
	return &Handler{}
}
