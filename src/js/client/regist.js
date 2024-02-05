import axios from "axios";

const WORKING_URL_REG = "/maimaidx.jp\/maimai-mobile\/friend\/friend(Genre|Level)Vs\/battleStart/";
const BASE_URL = "https://maimai-fve.maya2silence.com";

const POST_HEADER = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, method: "post" }
const SEPARATE = "\t";

let _m = document.getElementById("__mcl");
const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const modal = 
    `<div style="position: fixed; z-index: 1000; inset: 0px; background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center;">
        <div style="background-color: rgb(255, 255, 255); padding: 1.5rem; max-width: 500px; max-height: 500px; border-radius: 4px; box-sizing: border-box; width: 100%;">
            <div style="text-align: left;">
            <h2 style="margin-top: 0px; margin-bottom: 0px; font-weight: 600; font-size: 1.25rem; line-height: 1.25; color: rgb(0, 68, 158);">maimai-fve</h2>
            </div>
            <div id="__mcl" style="margin: 1rem 0px 0.5rem; overflow: hidden; border: 1px solid rgb(51, 51, 51); border-radius: 5px; height: 300px; padding: 0.5rem; color: rgba(0, 0, 0, 0.8);"></div>
            <text id="__send" style="display: none"></text>
            <div style="font-size: 0.8rem;">処理を中断するにはページをリロードしてください</div>
        </div>
    </div>`;

try {
    init();
    checkWorkingPage();
    await wait(500);
    await makeBody();
    await wait(500);
    await send();
} catch (e) {
    console.error(e);
    addMsg(`[エラー] ${e}`, true);
}

async function init() {
    // 特に意味は無いけどReactでガワを作る
    if (!_m) {
        let div = document.createElement("div");
        div.id = "__modal";
        div.innerHTML = modal
        document.body.appendChild(div);
        addMsg("初期化完了");
    } else {
        throw "既に起動しています！";
    }
}

async function makeBody() {
    try {
        let musics = document.querySelectorAll("div.w_450.m_15.p_3.f_0"),
            __ = document.getElementById("__send");

        // 曲が1つも無かったら即効で終わらせる
        if (!musics.length) {
            throw "データがありません!";
        }

        // ヘッダー分を先に取得
        __.value = getHeader();
        await wait(1000);
        for (let i = 0; i < musics.length; i++) {
            try {
                __.value += getData(musics[i]);
            } catch (e) {
                console.error(e);
                continue;
            }
        }
        // 最後にタイムスタンプを付与
        __.value += appendTimeStamp();

        addMsg("データ取得が完了しました");
        return true;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

function appendTimeStamp() {
    let date = new Date();
    return "\n" + date.toLocaleString();
}

async function send() {
    try {
        addMsg("データを送信します");
        axios.post(`${BASE_URL}/regist`, { data: document.getElementById("__send").value }, POST_HEADER)
            .then((d) => {
                addMsg("送信が完了しました");
                addMsg("↓↓↓URLはこちら↓↓↓");
                let li = document.createElement("li"),
                    a = document.createElement("a");
                a.href = d.data.url;
                a.innerText = d.data.url;
                a.target = "__blank";
                a.rel = "noopenner";
                li.style.listStyle = "none";
                li.appendChild(a);
                document.getElementById("__mcl").appendChild(li);
            }).catch((err) => {
                console.error(err);
                throw "エラーが発生しました";
            });
    } catch (e) {
        throw e;
    }
}


function getData(e) {
    try {
        // 抽出に使う正規表現
        const REP_DIFF_WORD = /diff_(?<diff>\w+)\.png/;
        const REP_KIND_WORD = /music_(?<kind>\w+)\.png/;
        const REP_RAMP_WORD = /music_icon_(?<ramp>\w+)\.png/;

        // 楽曲情報
        let title = e.querySelector(".music_name_block").innerText,
            diff = r(e.querySelector("img.h_20.f_l").src, REP_DIFF_WORD, "?diff"),
            kind = diff == "utage" ? "utage" : r(e.querySelector(".music_kind_icon").src, REP_KIND_WORD, "?kind"),
            lv = e.querySelector(".music_lv_block").innerText,
            scores = e.querySelectorAll(`td.${diff}_score_label`),
            _self_ramp = e.querySelectorAll(`td.t_l.f_0>img:not(:first-child)`),
            _rival_ramp = e.querySelectorAll(`td.t_r.f_0>img:not(:last-child)`);

        // 要素数が2未満の場合はスコア情報ではない可能性
        if (scores.length < 2) throw "楽曲情報ではない可能性があります";

        let self_score = scores[0].innerText.replace("%", "").replace("―", "0").replace(" ", ""),
            rival_score = scores[1].innerText.replace("%", "").replace("―", "0").replace(" ", ""),
            self_ramp = [..._self_ramp].map((e) => { return r(e.src, REP_RAMP_WORD) }).join("/"),
            rival_ramp = [..._rival_ramp].map((e) => { return r(e.src, REP_RAMP_WORD) }).join("/");
        return "\n" + title + SEPARATE + lv + SEPARATE + diff + SEPARATE + kind + SEPARATE + self_score + SEPARATE + self_ramp + SEPARATE + rival_score + SEPARATE + rival_ramp;
    } catch (err) {
        console.error(err);
        throw err;
    }

    function r(t, r, u = " ") {
        return t.match(r)[1] ?? u;
    }
}

function getHeader() {
    try {
        // ヘッダー分を先に作成する
        let self_name = document.querySelector("div.friend_vs_you_block>div:nth-child(4)").innerText,
            self_rank = document.querySelector("div.friend_vs_you_block>div:nth-child(3)>:last-child").innerText,
            rival_name = document.querySelector("div.friend_vs_friend_block>div:nth-child(4)").innerText,
            rival_rank = document.querySelector("div.friend_vs_friend_block>div:nth-child(3)>:last-child").innerText,
            score_type = document.querySelectorAll("select[name='scoreType']>option:checked")[0].innerText,
            b_type = getParam("genre") && getParam("diff") && !getParam("level"),
            b_class = b_type ? "ジャンル別" : "レベル別",
            param = "";

        if (b_type) {
            param = document.querySelector(`select[name="genre"]>option[value="${getParam("genre")}"]`).innerText;
        } else {
            param = document.querySelector(`select[name="level"]>option[value="${getParam("level")}"]`).innerText;
        }

        addMsg(`取得カテゴリ: ${score_type}/${b_class}/${param}`);
        return self_name + SEPARATE + self_rank + SEPARATE + rival_name + SEPARATE + rival_rank + SEPARATE + score_type + SEPARATE + b_class + SEPARATE + param;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

function getParam(key) {
    let url = window.location,
        searchParams = new URLSearchParams(url.search);
    return searchParams.get(key) ?? false;
}

function checkWorkingPage() {
    let url = window.location;
    if (!url.href.match(WORKING_URL_REG)) {
        throw "フレンドVSページで「バトル実行」した状態で起動してください！";
    }
}

function addMsg(m, w = false) {
    let l = document.createElement("li");
    l.innerText = m;
    l.style.listStyle = "none";
    l.style.marginBottom = "0.25rem";
    l.style.fontWeight = w ? "bold" : "";
    l.style.color = w ? "red" : "";
    document.getElementById("__mcl").appendChild(l);
}
