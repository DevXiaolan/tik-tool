/*
 * @Author: Mr.He 
 * @Date: 2018-06-11 14:32:39 
 * @Last Modified by: Mr.He
 * @Last Modified time: 2018-06-13 11:35:30
 * @content: 
 */

import React, { Component } from "react";
import { Button, Table, Modal, Input, Icon } from "antd";
import * as uuid from "uuid";
import axios from "axios";
import moment from "moment";
import config, { BACK_SYSTEM_URL } from "../../../config/config";
const Search = Input.Search;
import "./index.css";
// import { getUserInfo } from "../../utils/common";

const columns = [{
    title: 'mobile/uid',
    dataIndex: 'userMobile',
}, {
    title: 'periodName',
    dataIndex: 'periodName',
}, {
    title: '数量',
    dataIndex: 'tikQty',
}, {
    title: '买入均价',
    dataIndex: 'buyPrice',
    render(text, record) {
        record.buyPrice = Math.round(record.buyPrice * 1000) / 1000;
        return record.buyPrice;
    }
}, {
    title: '创建日期',
    dataIndex: 'createdAt',
    render(text, record, index) {
        record.datetime = moment(text).format("YYYY-MM-DD HH:mm:ss");
        return record.datetime;
    }
}];

/* 记录发现coin */
let periods = {};

export default class Trade extends Component {
    constructor() {
        super();

        this.state = {
            data: [],
            /* 分页相关 */
            pagination: {
                pageSize: 20,
                page: 1,
                current: 1,
                total: 0
            },
            loading: false,
        }

    }

    paginationChange = (pagination, filters, sorter) => {
        // console.log(pagination, filters, sorter);
        this.setState({
            pagination
        });
        setTimeout(this.fetch, 0)
    }
    paginationReset = () => {
        let { pagination } = this.state;
        pagination.current = 1;
        pagination.page = 1;
        this.setState({
            pagination
        })
    }

    getUserInfo = (item) => {
        return new Promise((resolve, reject) => {
            axios({
                url: BACK_SYSTEM_URL + "/v1/user/" + item.uid,
                method: "get",
                responseType: "json"
            }).then((resp) => {
                let result = resp.data;
                if (result.code != 0) {
                    return item.userMobile = item.uid;
                }

                console.log(result);
                item.userMobile = result.data.auth.sms.mobile;
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                resolve();
            });
        })
    }

    fetch = (params) => {
        let _this = this;
        this.setState({
            loading: true,
        })

        let { current, pageSize } = this.state.pagination;

        let options = {
            url: BACK_SYSTEM_URL + "/v1/userasset",
            method: "get",
            data: {
                page: current - 1,
                limit: pageSize
            },
            responseType: "json"
        };
        if (params && params.keyword) {
            options.data.keyword = params.keyword;
        }

        axios.get(options.url, {
            params: options.data
        }).then(async (resp) => {
            resp = resp.data;
            if (resp.code != 0) {
                alert(resp.message);
                return
            }

            let ps = [];
            for (let item of resp.data.rows) {
                item.periodName = periods[item.periodId].displayName || item.periodId;
                ps.push(this.getUserInfo(item));
            }
            await Promise.all(ps);
            _this.setState({
                data: resp.data.rows,
                loading: false,
                pagination: {
                    total: resp.data.count,
                    page: Math.ceil(resp.data.count / pageSize),
                    current,
                    pageSize
                }
            });
        }).catch((err, msg) => {
            console.log(err, msg);
            alert(err.message);
        }).finally(() => {
            _this.setState({
                loading: false
            })
        })
    }

    fetchPeriod = async () => {
        let result = await axios({
            url: BACK_SYSTEM_URL + "/v1/period",
            method: "get",
            params: {},
            responseType: "json"
        });

        if (result.data.code != 0) {
            return alert(result.data.message);
        }
        for (let item of result.data.data.rows) {
            periods[item._id] = item;
        }
    }

    onSearch = (value) => {
        if (!value) {
            return;
        }
        this.paginationReset();
        this.fetch({
            keyword: value
        });
    }

    async componentDidMount() {
        await this.fetchPeriod();
        this.fetch();
    }

    render() {
        return (
            <section>
                <h1>
                    用户资产管理
                </h1>
                <Search
                    placeholder="mobile/uid"
                    onSearch={this.onSearch}
                    className="inputSearch"
                    enterButton="Search"
                    size="large"
                />
                <Button type="primary" onClick={this.fetch} size="large">ALL</Button>
                <Table columns={columns}
                    rowKey={record => record._id}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.paginationChange}
                />
            </section>
        )
    }
}