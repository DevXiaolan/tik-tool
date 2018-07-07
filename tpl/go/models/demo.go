package models

import (
	"tik-go/core/timelib"
)

//go:generate tools gen method Demo
//Demo 数据库模型样例
type Demo struct {
	// 主键 ID
	ID uint64 `gorm:"primary_key;column:id" sql:"type:bigint(64) unsigned auto_increment;not null" json:"id"`
	// 入库备注
	Remark string `gorm:"column:remark" sql:"type:varchar(255);not null;default:''" json:"remark"`
	// 创建时间
	CreateTime timelib.MySQLTimestamp `gorm:"column:create_time" sql:"type:bigint(64);not null" json:"createTime"`
	// 更新时间
	UpdateTime timelib.MySQLTimestamp `gorm:"column:update_time" sql:"type:bigint(64);not null" json:"updatetime"`
}
