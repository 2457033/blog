const express = require('express')

const request = require('request')

const querystring = require('querystring');
const { resolve } = require('path');

const getUrlByObj = (...args) => {
    return querystring.stringify(...args);
}

const key = 'b207a7432b24c0d23d62c8c3c44e2a05'
const QQKey = 'TXSBZ-7NEWQ-P6F5N-B4KOL-DXUN7-53BFI'

const radius = 1000
const auto_extend = 0

const apiList = {
    getPosition: {
        url: 'https://restapi.amap.com/v3/ip',
        key: key,
        getQueryUrl: function () {
            return `${this.url}?key=${this.key}`
        }
    },
    getSurroundings: {
        url: 'https://restapi.amap.com/v3/place/around',
        key: key,
        radius: 30000,
        getQueryUrl: function(query) {
            return `${this.url}?key=${this.key}&location=${query.location}&radius=${this.radius}&page=${query.page}&offset=${query.offset}`
        }
    },
    getSurroundingsQQ: {
        url: 'https://apis.map.qq.com/ws/place/v1/explore',
        key: QQKey,
        radius: 1000,
        auto_extend: 0,
        getQueryUrl: function(query) {
            return `${this.url}?key=${this.key}&boundary=nearby(${query.location},${radius},${auto_extend})&page_index=${query.page}&page_size=${query.offset}`
        }
    }
}

const getPosition = () => {
    const queryUrl = apiList.getPosition.getQueryUrl();
    return new Promise((resolve, reject) => {
        request({
            url: queryUrl,
            gzip: true
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                try {
                    const jsonObj = JSON.parse(body);
                    resolve(jsonObj)
                } catch (err) {
                    reject(err);
                }
            } else {
                reject('请求异常');
            }
        })
    })
}

const getSurroundings = (data) => {
    const queryUrl = apiList.getSurroundings.getQueryUrl(data)
    return new Promise((resolve, reject) => {
        request({
            url: queryUrl,
            gzip: true
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                try {
                    const jsonObj = JSON.parse(body);
                    resolve(jsonObj)
                } catch (err) {
                    reject(err);
                }
            } else {
                reject('请求异常');
            }
        })
    })
}

const getSurroundingsQQ = (data) => {
    const queryUrl = apiList.getSurroundingsQQ.getQueryUrl(data)
    return new Promise((resolve, reject) => {
        request({
            url: queryUrl,
            gzip: true
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                try {
                    const jsonObj = JSON.parse(body);
                    resolve(jsonObj)
                } catch (err) {
                    reject(err);
                }
            } else {
                reject('请求异常');
            }
        })
    })
}

module.exports = {
    getPosition,
    getSurroundings,
    getSurroundingsQQ
}