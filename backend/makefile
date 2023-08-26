include .env
export $(shell sed 's/=.*//' .env)

start:
	go run main.go

run-generatesigner:
	go run cmd/generatesigner/main.go
