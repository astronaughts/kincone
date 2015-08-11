var Kincone = require("./lib/Kincone");

// 認証情報
var auth = {
    email: "your@email.com",
    password: "password"
};

//// ログイン
var session = Kincone.login(auth, function (userName) {
    // ユーザー名
    console.log(userName);
});

//// 勤怠
var attendance = session.getAttendance();

// 当日の出勤
attendance.start();

// 当日の退勤
attendance.end();

// 当月の勤怠一覧
attendance.list(function (list) {
    console.log(list);
});

// 年月指定した過去の勤怠一覧
attendance.list(2015, 7, function (list) {
    console.log(list);
});