import React, { useMemo, useCallback, useState } from 'react';
import xxh from "xxhashjs";

const SongBox = (({ body, filter, sort }) => {
    // ソートを早くするために土台を作っておく
    const sort_base = body.map((e, i) => {
        let a = e.split("\t");
        return [i, Math.round((a[4] - a[5]) * 10000), Number(a[1].replace("+", ".7"))];
    });

    // ソート基準 [デフォ,差分,レベル]
    const sort_value = [
        sort_base.map((e) => e[0]),
        sort_base.sort((a, b) => a[1] > b[1] ? 1 : a[1] === b[1] ? 0 : -1).map((e) => e[0]),
        sort_base.sort((a, b) => a[2] > b[2] ? 1 : a[2] === b[2] ? 0 : -1).map((e) => e[0])
    ];

    const organize = () => {
        let v = sort.order ? sort_value[sort.key] : sort_value[sort.key].reverse();
        return v.map((i) => <ScoreBoxHeader key={i} body={body[i].split("\t")} filter={filter} />);
    };

    return (
        <>
            {organize()}
        </>
    );
});

// score_boxの外側の更に外側
const ScoreBoxHeader = React.memo(({ body, filter }) => {
    // スコアの勝ち負け引きを数字で返す関数
    const getStatus = useCallback(() => {
        let a = parseFloat(param.s_score), b = parseFloat(param.r_score);
        return a == b ? 0 : a > b ? 1 : -1;
    }, []);

    // 非表示設定に該当する場合はd-noneを返す関数
    const isHidden = useCallback(() => {
        return filter.length ? filter.some((e) => f_status[e] === true) ? true : false : false;
    }, [filter]);

    const rampRank = useCallback((t) => {
        return (t == "app" || t == "fdxp") ? 4 : (t == "ap" || t == "fdx") ? 3 : (t == "fcp" || t == "fsp") ? 2 : (t == "fc" || t == "fs") ? 1 : 0;
    });

    const param = {
        title: body[0],     // タイトル
        h_lv: body[1],      // 譜面レベル
        h_diff: body[2],    // 難易度 (expert, master etc.)
        h_kind: body[3],    // 譜面区分 (dx, standard)
        s_score: body[4],   // 自分のスコア
        s_ramp: body[5].split("/"),    // 自分のランプ
        r_score: body[6],   // 相手のスコア
        r_ramp: body[7].split("/"),    // 相手のランプ
    };

    // 都度計算するのはコストがかかるので、事前に条件に合致するか計算しておく
    const filter_status = [
        getStatus() > 0,    // スコア(勝ち)
        getStatus() == 0,   // スコア(引き分け)
        getStatus() < 0,    // スコア(負け)
        param.s_score <= 0, // 未プレイ(自分)
        param.r_score <= 0, // 未プレイ(相手)
        param.s_score <= 0 && param.r_score <= 0, // 未プレイ(両方)
        param.h_kind != "dx",   // 譜面区分(スタンダード)
        param.h_kind == "dx",   // 譜面区分(でらっくす)
        rampRank(param.s_ramp[0]) >= 4,
        rampRank(param.s_ramp[0]) >= 3,
        rampRank(param.s_ramp[0]) >= 2,
        rampRank(param.s_ramp[0]) >= 1,
        rampRank(param.s_ramp[0]) == 0,
        rampRank(param.r_ramp[1]) >= 4,
        rampRank(param.r_ramp[1]) >= 3,
        rampRank(param.r_ramp[1]) >= 2,
        rampRank(param.r_ramp[1]) >= 1,
        rampRank(param.r_ramp[1]) == 0,
        rampRank(param.s_ramp[0]) >= 4,
        rampRank(param.s_ramp[1]) >= 3,
        rampRank(param.s_ramp[1]) >= 2,
        rampRank(param.s_ramp[1]) >= 1,
        rampRank(param.s_ramp[1]) == 0,
        rampRank(param.r_ramp[0]) >= 4,
        rampRank(param.r_ramp[0]) >= 3,
        rampRank(param.r_ramp[0]) >= 2,
        rampRank(param.r_ramp[0]) >= 1,
        rampRank(param.r_ramp[0]) == 0,
    ];

    // hookに登録
    const [f_status] = useState(filter_status);
    const _ScoreBox = useMemo(() => <ScoreBox param={param} isHidden={isHidden()} />, [isHidden()]);

    // viewを返す
    return (
        <>{_ScoreBox}</>
    );
});

// score_boxの外側
const ScoreBox = React.memo(({ param, isHidden }) => {
    // スコアの勝ち負け引きを数字で返す関数
    const getStatus = useCallback(() => {
        let a = parseFloat(param.s_score), b = parseFloat(param.r_score);
        return a == b ? 0 : a > b ? 1 : -1;
    });

    // 非表示設定に該当する場合はd-noneを返す関数
    const _isHidden = useCallback(() => { return isHidden ? "d-none" : ""; }, [isHidden]);

    // 勝ち負けのclass名を返す関数
    const rBattle = useCallback(() => {
        return getStatus() > 0 ? "score_won" : getStatus() == 0 ? "score_draw" : "score_lose";
    }, []);

    // viewを返す
    return (
        <div className={`score_box ${rBattle()} ${_isHidden()}`}>
            <ScoreBody title={param.title} h_lv={param.h_lv} h_diff={param.h_diff} h_kind={param.h_kind}
                s_score={param.s_score} s_ramp={param.s_ramp} r_score={param.r_score} r_ramp={param.r_ramp} />
        </div>
    );
});

// score_boxの内側
const ScoreBody = React.memo(({ title, h_diff, h_lv, h_kind, s_score, s_ramp, r_score, r_ramp }) => {
    // スコアの差分を取得
    const getDiffVal = () => {
        let a = Math.round((s_score - r_score) * 10000) / 10000;
        return a == 0 ? "Draw" : (a > 0 ? "+" : "") + `${a}%`;
    };

    const renameRamp = (t) => {
        if (t == "back") {
            return "　";
        } else if (t.match(/^(app|fcp|fdxp|fsp)$/)) {
            return t.substring(0, t.length - 1) + "+";
        } else {
            return t;
        }
    }

    return (
        <>
            {/* 譜面の追加情報 */}
            <div className="score_box_header">
                {/* Diff */}
                <div className={"score_box_header_difficult " + `difficult_${h_diff}`}>{h_diff}</div>
                {/* Lv */}
                <div className="score_box_header_level">{`Lv${h_lv}`}</div>
                {/* Kind */}
                <div className={"score_box_header_kind " + `kind_${h_kind}`}>{h_kind == "dx" ? "でらっくす" : "スタンダード"}</div>
            </div>
            {/* タイトル */}
            <div className="score_box_middle">{title}</div>
            {/* スコア情報 */}
            <div className="score_box_footer">
                <div className="s_b_f_outer">
                    {/* 自分(登録者) */}
                    <div className="s_b_f_inner">
                        <span className="s_b_f_i_label">YOU</span>
                        <span className="s_b_f_i_value">{`${s_score}%`}</span>
                    </div>
                    {/* 差分 */}
                    <div className="s_b_f_inner">
                        <span className="s_b_f_i_value">{getDiffVal()}</span>
                    </div>
                    {/* ライバル */}
                    <div className="s_b_f_inner">
                        <span className="s_b_f_i_label">RIVAL</span>
                        <span className="s_b_f_i_value">{`${r_score}%`}</span>
                    </div>
                </div>
                <div className="s_b_f_outer">
                    {/* 自分(登録者) */}
                    <div className="s_b_f_inner">
                        <span className={`s_b_f_i_ramp ${s_ramp[0]}`}>{renameRamp(s_ramp[0]).toUpperCase()}</span>
                        <span className={`s_b_f_i_ramp ${s_ramp[1]}`}>{renameRamp(s_ramp[1]).toUpperCase()}</span>
                    </div>
                    <div className="s_b_f_inner"></div>
                    <div className="s_b_f_inner">
                        <span className={`s_b_f_i_ramp ${r_ramp[1]}`}>{renameRamp(r_ramp[1]).toUpperCase()}</span>
                        <span className={`s_b_f_i_ramp ${r_ramp[0]}`}>{renameRamp(r_ramp[0]).toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </>
    );
});

export default SongBox;