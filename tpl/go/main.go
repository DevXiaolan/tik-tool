package main

import (
	"{group}/{name}/libs"
	"{group}/{name}/src/apis/demo"

	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	app := gin.Default()
	app.Use(gin.Recovery())

	RootRouter := app.Group("/v1.0.0")

	RootRouter.POST("/demo", libs.ParseRequest(&demo.Demo{}))

	app.Run()
}
