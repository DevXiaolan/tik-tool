package libs

import (
	JSON "encoding/json"
	"fmt"
	"net/http"
	"reflect"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// Request 基本请求接口，要求实现Handle方法
type Request interface {
	Handle(c *gin.Context) (interface{}, CommonErr)
}

// 是不是简单类型
func isSimpleType(rv reflect.Value) bool {
	switch rv.Kind() {
	case reflect.Int:
		return true
	case reflect.Int8:
		return true
	case reflect.Int16:
		return true
	case reflect.Int32:
		return true
	case reflect.Int64:
		return true
	case reflect.Uint:
		return true
	case reflect.Uint8:
		return true
	case reflect.Uint16:
		return true
	case reflect.Uint32:
		return true
	case reflect.Uint64:
		return true
	case reflect.Float32:
		return true
	case reflect.Float64:
		return true
	case reflect.String:
		return true
	case reflect.Bool:
		return true
	default:
		return false
	}
}

// 把一个map[string]interface 转化成一个 struct
func setMapToStruct(m map[string]interface{}, s interface{}) interface{} {

	rt := reflect.TypeOf(s)
	newV := reflect.New(rt)
	rv := reflect.Indirect(newV)

	for i := 0; i < rt.NumField(); i++ {
		field := rt.Field(i)
		json := field.Tag.Get("json")
		fieldType := field.Type.String()
		defaultvalue := toType(field.Tag.Get("default"), fieldType)
		if isSimpleType(rv.Field(i)) {
			if fieldValue, ok := m[json]; ok {
				defaultvalue = toType(fmt.Sprintf("%v", fieldValue), fieldType)
			}

			rv.Field(i).Set(reflect.ValueOf(defaultvalue))
		} else {
			// 复杂类型
			newStruct := rv.Field(i).Interface()
			if subMap, ok := m[json]; ok {
				switch t := subMap.(type) {
				case map[string]interface{}:
					newStruct = setMapToStruct(t, newStruct)
				}
			}
			rv.Field(i).Set(reflect.ValueOf(newStruct))
		}
	}

	return rv.Interface()
}

// 从context中提取参数
func Scan(req Request, c *gin.Context) {

	realReqType := reflect.TypeOf(reflect.Indirect(reflect.ValueOf(req)).Interface())
	realReqValue := reflect.Indirect(reflect.ValueOf(req))

	// raw data
	rawData, _ := c.GetRawData()
	m := map[string]interface{}{}

	if len(rawData) > 0 {
		JSON.Unmarshal(rawData, &m)
	}

	for i := 0; i < realReqType.NumField(); i++ {
		field := realReqType.Field(i)

		fieldType := field.Type.String()
		in := field.Tag.Get("in")
		json := field.Tag.Get("json")
		if strings.Contains(json, ",") {
			jsonArr := strings.Split(json, ",")
			json = jsonArr[0]
		}
		defaultvalue := toType(field.Tag.Get("default"), fieldType)

		switch in {
		case "query":
			queryValue := c.DefaultQuery(json, "")
			if queryValue != "" {
				defaultvalue = toType(queryValue, fieldType)
			}
			realReqValue.Field(i).Set(reflect.ValueOf(defaultvalue))
		case "headers":
			headerValue := c.GetHeader(json)
			if headerValue != "" {
				defaultvalue = toType(headerValue, fieldType)
			}
			realReqValue.Field(i).Set(reflect.ValueOf(defaultvalue))
		case "param":
			paramValue := c.Param(json)
			if paramValue != "" {
				defaultvalue = toType(paramValue, fieldType)
			}
			realReqValue.Field(i).Set(reflect.ValueOf(defaultvalue))
		case "body":
			// bodyValue, _ := c.GetPostForm("aaa")
			contentType := c.GetHeader("content-type")
			bodyValue := ""
			if contentType == "application/json" {
				// json mode

				if isSimpleType(realReqValue.Field(i)) {
					// 简单类型
					if bodyValue, ok := m[json]; ok {
						defaultvalue = toType(fmt.Sprintf("%v", bodyValue), fieldType)
					}
					realReqValue.Field(i).Set(reflect.ValueOf(defaultvalue))
				} else {
					// 复杂类型
					newStruct := realReqValue.Field(i).Interface()

					if subMap, ok := m[json]; ok {
						switch t := subMap.(type) {
						case map[string]interface{}:
							newStruct = setMapToStruct(t, newStruct)
						}
					}

					realReqValue.Field(i).Set(reflect.ValueOf(newStruct))
				}

			} else {
				// form data
				bodyValue, _ = c.GetPostForm(json)
				if bodyValue != "" {
					defaultvalue = toType(bodyValue, fieldType)
				}
				realReqValue.Field(i).Set(reflect.ValueOf(defaultvalue))
			}
		}
	}
}

// 将拿到的参数或默认值，转换成特定类型
func toType(v string, t string) interface{} {

	switch t {
	case "string":
		return v
	case "uint64":
		intval, err := strconv.Atoi(v)
		if err != nil {
			return 0
		}
		return uint64(intval)
	case "int64":
		intval, err := strconv.Atoi(v)
		if err != nil {
			return 0
		}
		return int64(intval)
	case "uint32":
		intval, err := strconv.Atoi(v)
		if err != nil {
			return 0
		}
		return uint32(intval)
	case "int32":
		intval, err := strconv.Atoi(v)
		if err != nil {
			return 0
		}
		return int32(intval)
	case "int16":
		intval, err := strconv.Atoi(v)
		if err != nil {
			return 0
		}
		return int16(intval)
	case "uint16":
		intval, err := strconv.Atoi(v)
		if err != nil {
			return 0
		}
		return uint16(intval)
	case "float32":
		floatval, err := strconv.ParseFloat(v, 64)
		if err != nil {
			return 0.0
		}
		return float32(floatval)
	case "float64":
		floatval, err := strconv.ParseFloat(v, 64)
		if err != nil {
			return 0.0
		}
		return floatval
	}
	return t
}

// 将Request对象预处理，并返回gin Handler
func ParseRequest(request Request) gin.HandlerFunc {
	return func(c *gin.Context) {
		Scan(request, c)
		result, err := request.Handle(c)
		if err.Code > 0 {
			c.JSON(err.HTTPCode, err)
		} else {
			c.JSON(http.StatusOK, result)
		}
	}
}
