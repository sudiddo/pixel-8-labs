package main

import (
	"crypto/ecdsa"
	"encoding/hex"
	"fmt"
	"log"

	"github.com/ethereum/go-ethereum/crypto"
)

func main() {
	privateKey, err := crypto.GenerateKey()
	if err != nil {
		log.Fatal(err)
	}

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		log.Fatal("error casting private key to PublicKeyECDSA")
	}

	address := crypto.PubkeyToAddress(*publicKeyECDSA).Hex()
	privateKeyHex := hex.EncodeToString(crypto.FromECDSA(privateKey))

	fmt.Println("Address:", address)
	fmt.Println("Private Key:", privateKeyHex)
}
