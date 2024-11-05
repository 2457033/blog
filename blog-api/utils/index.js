const express = require('express')

const request = require('request')

const querystring = require('querystring');

const getUrlByObj = (...args) => {
    return querystring.stringify(...args);
}

const apiList = {
    getExchange: {
        url: 'https://devapi.qweather.com/v7/weather/now',
        key: '559f867d4ab445b49a62185289e86d05',
        getQueryUrl: function (query) {
            return `${this.url}?key=${this.key}&location=${query.location}`
        }
    },
    getCity: {
        url: 'https://geoapi.qweather.com/v2/city/lookup',
        key: '559f867d4ab445b49a62185289e86d05',
        getQueryUrl: function (query) {
            return `${this.url}?key=${this.key}&location=${query.location}`
        }
    }
}

const getCity = (location) => {
    const queryUrl = apiList.getCity.getQueryUrl({ location: location });
    return new Promise((resolve, reject) => {
        request({
            url: queryUrl,
            gzip: true,
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

const getExchange = (location) => {
    const queryUrl = apiList.getExchange.getQueryUrl({ location: location });
    return new Promise((resolve, reject) => {
        request({
            url: queryUrl,
            gzip: true,
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
    getExchange,
    getCity
}