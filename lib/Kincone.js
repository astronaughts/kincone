"use strict";

var _ = require("lodash");

var client = require("cheerio-httpcli");
client.setBrowser("chrome");

var Attendance = require("./Attendance");

var Kincone = {};

Kincone.login = function (auth, callback) {

    var kincone = {}

    // kincone のセッション
    var session = client
        .fetch("https://kincone.com/auth/login")
        .then(function (result) {
            return result.$("form").submit(auth);
        }).then(function (result) {
            var nameText = result.$("#fat-menu a.dropdown-toggle").text();
            callback(_.trim(nameText));
        });

    // 勤怠管理
    kincone.getAttendance = function () {
        return Attendance(client, session)
    };

    return kincone;
};

module.exports = Kincone;