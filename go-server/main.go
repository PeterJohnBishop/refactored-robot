package main

import (
	"go-server/main.go/serveGin"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		serveGin.Init()
	}()

	go func() {
		serveGin.HandleMessages()
	}()

	wg.Wait()
}
