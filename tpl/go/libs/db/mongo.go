package db

import (
	"fmt"
	"os"
	"time"

	"github.com/davecgh/go-spew/spew"
	_ "github.com/joho/godotenv/autoload"
	mgo "gopkg.in/mgo.v2"
)

// GlobalMgoSession 连接池
var GlobalMgoSession *mgo.Session

func init() {
	dns := GetDSN()
	spew.Dump(dns)
	globalMgoSession, err := mgo.DialWithTimeout(dns, 10*time.Second)
	if err != nil {
		panic(err)
	}
	GlobalMgoSession = globalMgoSession
	GlobalMgoSession.SetMode(mgo.Monotonic, true)
	GlobalMgoSession.SetPoolLimit(200)
}

// GetMongoSession 获取mongo连接
func GetMongoSession() *mgo.Session {
	return GlobalMgoSession.Clone()
}

// GetDSN
func GetDSN() string {
	HOST := os.Getenv("MONGO_HOST")
	PORT := os.Getenv("MONGO_PORT")
	DB := os.Getenv("MONGO_DB")
	return fmt.Sprintf("mongodb://%s:%s/%s", HOST, PORT, DB)
}
