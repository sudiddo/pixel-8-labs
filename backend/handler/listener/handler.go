package listener

import "github.com/ethereum/go-ethereum/accounts/abi"

type Handler struct {
	// config goes here
	// e.g PostgreSQL, MongoDB, GCS, etc.
	contractAbi abi.ABI
}

func NewHandler() (*Handler, error) {
	return &Handler{
		//contractAbi: nil
	}, nil
}
