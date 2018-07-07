package demo

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Demo struct {
	Keyword uint64 `in:"query" json:"kw" validate:"@uint64[0,10]"`
}
type ResBody struct {
	Code    uint32      `json:"code"`
	Data    interface{} `json:"data"`
	Message string      `json:"message"`
}

func (req Demo) Handle(ctx *gin.Context) {

	ctx.JSON(http.StatusOK, ResBody{
		Code:    http.StatusOK,
		Message: "",
		Data:    nil,
	})
}
