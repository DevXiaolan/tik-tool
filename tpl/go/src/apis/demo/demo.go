package demo

import (
	"{group}/{name}/libs"

	"github.com/gin-gonic/gin"
)

type Demo struct {
	GetID uint32 `in:"query" json:"getId"`
	PostID uint64  `in:"body" json:"postId" default:"0"`
	Body   DemoBody `in:"body" json:"ext"`
}

type DemoBody struct {
	Desc string `json:"desc"`
}

func (req Demo) Handle(ctx *gin.Context) (res interface{}, err libs.CommonErr) {
	
	res = req
	return
}
