import React from 'react';
import { createRoot } from 'react-dom/client';
import axios from "axios";
import Body from './jsx/body';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        let l = localStorage.getItem("regist_list"),
            r = !l ? [] : await Promise.all(JSON.parse(l).map(async (e) => {
                return await axios.get(`/list/${e}`).then((d) => d.data).catch((e) => "")
            }));

        createBody(r.filter((e) => e != ""));
    } catch (e) {
        window.alert(e);
        let d = document.createElement("div");
        d.innerText = "エラーが発生しました";
        d.classList.add("alert", "alert-danger");
        document.body.appendChild(d);
    }
});

// リスト作成
function createBody(body) {
    return createRoot(document.getElementById("root")).render(<Body body={body} />);
}