package main

import (
	"github.com/pixel8labs/project-template/backend/cmd/server"
)

func main() {
	// Config DB here
	// databaseConfig := config.LoadDatabase()
	// make DB connection here

	//go listener.Run()

	server.Run()
}
