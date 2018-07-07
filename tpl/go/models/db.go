package models

import (
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"tik-go/core/mysql"

	"github.com/joho/godotenv"
)

var Connection mysql.MySQL

var DBTable = mysql.NewDBTable()

func init() {
	_, file, _, _ := runtime.Caller(0)
	dir := filepath.Dir(file)
	godotenv.Load(dir + "/../.env")
	port, _ := strconv.Atoi(os.Getenv("DB_PORT"))
	Connection = mysql.MySQL{
		Host:     os.Getenv("DB_HOST"),
		Port:     port,
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASSWORD"),
	}
	Connection.Init()
	DBTable.SetName(os.Getenv("DB_NAME"))
}
