package config

import (
	"crypto/ecdsa"

	"github.com/ethereum/go-ethereum/crypto"
	"github.com/kelseyhightower/envconfig"
)

type Signer struct {
	PrivateKey string `envconfig:"PRIVATE_KEY" required:"true"`
	Address    string `envconfig:"ADDRESS" required:"true"`

	PrivateKeyECDSA *ecdsa.PrivateKey
}

func LoadSigner() Signer {
	var config Signer
	envconfig.MustProcess("SIGNER", &config)

	privateKeyECDSA, err := crypto.HexToECDSA(config.PrivateKey)
	if err != nil {
		panic(err)
	}
	config.PrivateKeyECDSA = privateKeyECDSA

	return config
}
