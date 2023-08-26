package config

import "github.com/kelseyhightower/envconfig"

type WSEvent struct {
	WebsocketURL    string `envconfig:"WEBSOCKET_URL" required:"true"`
	ContractAddress string `envconfig:"CONTRACT_ADDRESS" required:"true"`
}

func LoadWSEvent() WSEvent {
	var config WSEvent
	envconfig.MustProcess("", &config)
	return config
}
