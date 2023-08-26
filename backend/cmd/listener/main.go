package listener

import (
	"github.com/pixel8labs/project-template/backend/config"
	"github.com/pixel8labs/project-template/backend/handler/listener"
	"github.com/pixel8labs/project-template/backend/pkg/wsevent"
)

func Run() {
	wsEventConfig := config.LoadWSEvent()

	ws := wsevent.New(wsEventConfig)
	_, err := listener.NewHandler()
	if err != nil {
		panic(err)
	}

	//ws.RegisterHandler(event, handler)

	ws.Run()
}
