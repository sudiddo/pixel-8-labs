package wsevent

import (
	"context"
	"log"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/pixel8labs/project-template/backend/config"
)

type WSEvent struct {
	client  *ethclient.Client
	query   ethereum.FilterQuery
	handler map[common.Hash]HandlerFunc
}

type HandlerFunc func(msg types.Log)

func New(conf config.WSEvent) WSEvent {
	client, err := ethclient.Dial(conf.WebsocketURL)
	if err != nil {
		panic(err)
	}
	coreAddress := common.HexToAddress(conf.ContractAddress)
	query := ethereum.FilterQuery{
		Addresses: []common.Address{
			coreAddress,
		},
	}
	return WSEvent{
		client:  client,
		query:   query,
		handler: make(map[common.Hash]HandlerFunc),
	}
}

func (ws *WSEvent) RegisterHandler(event common.Hash, handler HandlerFunc) {
	ws.handler[event] = handler
}

func (ws *WSEvent) Run() {
	logs := make(chan types.Log)
	sub, err := ws.client.SubscribeFilterLogs(context.Background(), ws.query, logs)
	if err != nil {
		panic(err)
	}

	for {
		select {
		case err := <-sub.Err():
			panic(err)
		case v := <-logs:
			if handler, ok := ws.handler[v.Topics[0]]; ok {
				handler(v)
			} else {
				log.Println("no handler for event", v.Topics[0])
			}
		}
	}
}
