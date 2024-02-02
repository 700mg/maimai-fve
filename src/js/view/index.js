import React from 'react';
import { createRoot } from 'react-dom/client';
import axios from "axios";
import Body from './jsx/body';

try {
    document.addEventListener("DOMContentLoaded", async () => {
        let id = document.body.dataset.id,
            response = await axios.get(`/data/${id}`)
                .then((e) => { return { header: e.data.header, body: e.data.body, timestamp: e.data.timestamp } })
                .catch((e) => { throw e });

        // 受信に成功したらリストを作成する
        createBody(response.header, response.body, response.timestamp);
    });
} catch (e) {
    window.alert(e);
    let d = document.createElement("div");
    d.innerText = "エラーが発生しました";
    d.classList.add("alert", "alert-danger");
    document.body.appendChild(d);
}

// リスト作成
function createBody(header, body, timestamp) {
    return createRoot(document.getElementById("root")).render(<Body header={header} body={body} timestamp={timestamp} />);
}
