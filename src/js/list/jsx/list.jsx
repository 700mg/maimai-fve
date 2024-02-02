import React, { useMemo, useCallback, useState } from 'react';
import xxh from "xxhashjs";

const ListBox = (({ body }) => {
    if (!body.length) {
        return <NoList />;
    } else {
        return body.sort((a, b) => a.timestamp < b.timestamp ? 1 : a.timestamp === b.timestamp ? 0 : -1).map((e) => {
            return <List key={xxh.h32(e.url, 0xABCD).toString(16)} data={e} />
        });
    }
});

const List = React.memo(({ data }) => {
    let h = data.header,    // ヘッダー部
        t = data.timestamp, // タイムスタンプ
        u = data.url;       // ID

    return (
        <div className='list_box'>
            <div className='list_box_inner'>
                <div className='list_detail'>
                    <div className='list_timestamp'>{t}</div>
                    <div className="list_detail_cond">{`${h[4]}/${h[5]}/${h[6]}`}</div>
                </div>
                <div className='list_detail_player'>
                    <div className='list_detail_player_box'>
                        <div>{`YOU (${h[1]})`}</div>
                        <div>{h[0]}</div>
                    </div>
                    <div className='list_detail_player_box flex-grow-0'>VS</div>
                    <div className='list_detail_player_box'>
                        <div>{`RIVAL (${h[3]})`}</div>
                        <div>{h[2]}</div>
                    </div>
                </div>
                <div className='list_detail_link'>
                    <a href={u}>{u}</a>
                </div>
            </div>
        </div>
    );
});

const NoList = (() => {
    return (
        <div className='alert alert-danger'>保存した登録リストがありません。</div>
    );
})

export default ListBox;