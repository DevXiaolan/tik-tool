package libs

import (
	"fmt"
)

// CommonErr 业务错误基础结构
type CommonErr struct {
	HTTPCode int         `json:"-"`
	Code     int         `json:"code"`
	Message  string      `json:"message"`
	Data     interface{} `json:"data"`
}

func (e CommonErr) Error() string {
	return fmt.Sprintf("[%d] %s", e.Code, e.Message)
}
