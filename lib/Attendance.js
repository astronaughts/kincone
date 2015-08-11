"use strict";

var _       = require("lodash"),
    moment  = require("moment"),
    util    = require("util");

var URL = {
    Index: "https://kincone.com/attendance",
    MonthSpecified: "https://kincone.com/attendance/index?year=%s&month=%s"
};

module.exports = function (client, session) {

    var Attendance = {};

    Attendance.start = function () {
        return session
            .then(function (result) {
                return client.fetch(URL.Index);
            })
            .then(function (result) {
                return result.$("form[action='https://kincone.com/attendance/start']").submit();
            });
    };

    Attendance.end = function () {
        return session
            .then(function (result) {
                return client.fetch(URL.Index);
            })
            .then(function (result) {
                return result.$("form[action='https://kincone.com/attendance/end']").submit();
            });
    };

    Attendance.list = function () {
        var list    = [],
            url     = URL.Index,
            callback;

        if (_.isNumber(arguments[0]) && _.isNumber(arguments[1])) {
            var date = moment().year(arguments[0]).month(arguments[1]);
            if (! date.isValid()) {
                throw new Error("date string is invalid.");
            } else {
                url = util.format(URL.MonthSpecified, date.year(), date.month());
            }
            callback = arguments[2];
        } else if (_.isFunction(arguments[0])) {
            callback = arguments[0];
        } else {
            throw new Error("invalid arguments.");
        }

        return session
            .then(function (result) {
                return client.fetch(url);
            })
            .then(function (result) {
                var $ = result.$;

                $("table tr").each(function (rowIndex, rowElement) {
                    if (rowIndex === 0)
                        return;

                    var attendance = {};
                    $(rowElement).find("td").each(function (colIndex, colElement) {
                        if (colIndex === 0) {
                            attendance.date = $(colElement).text();
                        } else if (colIndex === 1) {
                            attendance.startingTime = $(colElement).text();
                        } else if (colIndex === 2) {
                            attendance.leavingTime = $(colElement).text();
                        } else if (colIndex === 3) {
                            attendance.workTime = $(colElement).text();
                        } else {
                            return;
                        }
                    });

                    list.push(attendance);
                });

            }).finally(function () {
                callback(list);
            });
    };

    return Attendance;

};