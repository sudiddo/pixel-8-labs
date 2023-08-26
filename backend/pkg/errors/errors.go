package errors

type ValidationError struct {
	ErrorCode     string
	Message       string
	InternalError error
}

func (e ValidationError) Error() string {
	return e.Message
}

type ServerError struct {
	ErrorCode     string
	Message       string
	InternalError error
}

func (e ServerError) Error() string {
	return e.Message
}

type UnauthorizedAccessError struct {
	ErrorCode     string
	Message       string
	InternalError string
}

func (e UnauthorizedAccessError) Error() string {
	return e.Message
}

type NotFoundError struct {
	ErrorCode     string
	Message       string
	InternalError error
}

func (e NotFoundError) Error() string {
	return e.Message
}
