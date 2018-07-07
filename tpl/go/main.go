package main

import (
	"tik-go/core/httplib"
	"{group}/{name}/apis/demo"
	"{group}/{name}/models"

	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	app := gin.Default()
	app.Use(gin.Recovery())

	RootRouter := app.Group("/v1.0.0")

	RootRouter.GET("/demo", httplib.FromRequest(demo.Demo{}))
	models.DBTable.AutoMigrate(models.Connection.Get())
	app.Run()
}
