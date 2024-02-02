const express = require('express');
const router = express.Router();
const fs = require("fs");
const conf = require("../index.js");

/*==================================
    Middleware (前)
==================================*/
/**
 * ## Collect access log ##
 * アクセスしたユーザーのIP,リクエストURLを記録する
 */
router.use((req, res, next) => {
    let today = new Date().toLocaleDateString('sv-SE'),
        now = new Date().toLocaleTimeString('sv-SE'),
        ip = req.ip,
        to = req.originalUrl;

    const fs = require('fs');
    fs.appendFileSync(`./logs/access/${today}.txt`, `[${now}] from:${ip} request:${to}\n`);

    next();
});

/*==================================
    Base Routing
==================================*/
/**
 * ## Top page ##
 * トップページを表示する
 */
router.get("/", function (req, res) {
    res.render("top");
});

/**
 * ## View registed list ##
 * Cookieに登録されたリストを表示する
 */
router.get("/view", (req, res) => {
    res.render("list");
});

/**
 * ## Viewer ##
 */
router.get("/list/:id", (req, res) => {
    let path = `./data/${req.params.id}.dat`;
    if (!fs.existsSync(path)) {
        res.status(404).send("<h1>お探しのページは見つかりませんでした</h1>");
    } else {
        let body = fs.readFileSync(path, 'utf8').split("\n"),
            url = `${conf.host}/view/${req.params.id}`;
        res.json({ header: body.shift().split("\t"), timestamp: body.pop(), url: url });
    }
});

/**
 * ## Viewer ##
 * データ表示の為のテンプレートを表示する
 */
router.get("/view/:id", (req, res) => {
    if (!fs.existsSync(`./data/${req.params.id}.dat`)) {
        res.status(404).send("<h1>お探しのaページは見つかりませんでした</h1>");
    } else {
        // 登録したリストをCookieに保存
        res.render("view", { id: req.params.id });
    }
});

/**
 * ## Data send ##
 * データ表示の為のテンプレートを表示する
 */
router.get("/data/:id", (req, res) => {
    let path = `./data/${req.params.id}.dat`;
    if (!fs.existsSync(path)) {
        res.status(404).send("<h1>お探しのページは見つかりませんでした</h1>");
    } else {
        let body = fs.readFileSync(path, 'utf8').split("\n"),
            header = body.shift().split("\t"),
            timestamp = body.pop();
        res.json({ header: header, body: body, timestamp: timestamp });
    }
});

/**
 * ## Data register ##
 * フレンドVSデータを受信してファイルに保存する
 * ※apache+cgiで動作させる場合、POSTリクエストに対してエラーが発生するため
 * 　付属の.htaccessを設定してここの処理をregist.phpに切り替えること。
 */
router.post("/regist", (req, res) => {
    try {
        let body = req.body.data ? req.body : JSON.parse(req.body),
            p_id = publishId();
        fs.writeFileSync(`./data/${p_id}.dat`, body.data)
        if (!fs.existsSync(`./data/${p_id}.dat`)) {
            res.status(500).json({ msg: "エラーが発生しました" });
            return;
        }

        let url = `${conf.host}/view/${p_id}`;
        res.json({ url: url });
        return;
    } catch (e) {
        console.error(e);
    }

    function publishId() {
        // 暴走防止で上限を1000にする
        for (let cnt = 0; cnt < 1000; cnt++) {
            let rand = Math.random().toString(32).substring(2),
                dir = fs.readdirSync(`./data`);
            if (!dir.includes(`${rand}.dat`))
                return rand;
        }
        throw "IDが発行出来ませんでした";
    }
});

/*==================================
    Middleware (後)
==================================*/
/**
 * ## Certbot renew ##
 * SSL更新時に使う
 */
router.get("/.well-known/acme-challenge/:id", (req, res) => {
    let path = `.well-known/acme-challenge/${req.params.id}`;
    res.send(fs.readFileSync(path, 'utf8'));
    return;
});

/**
 * ## Request routing not found ##
 * ルーティングが無かった場合に404を返す
 */
router.use((req, res) => {
    res.status(404).send("<h1>お探しのページは見つかりませんでした</h1>");
});

/**
 * ## Server error ##
 * サーバーエラー時に500を返す
 */
router.use((err, req, res, next) => {
    logger(err);
    res.status(500).send('<h1 style="color:red;">サーバーでエラーが発生しました</h1>');
    function logger(msg) {
        let today = new Date().toLocaleDateString('sv-SE'),
            now = new Date().toLocaleTimeString('sv-SE');
        const fs = require('fs');

        fs.appendFileSync(`./logs/system/${today}.txt`, `[${now}] ${msg}\n`);
    }
});

module.exports = router;