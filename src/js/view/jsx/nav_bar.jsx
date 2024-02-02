import React from 'react';

const NavBar = React.memo(({ fcb, scb }) => {
    const handleFilterChange = (e) => {
        let k = e.target.value,
            v = e.target.checked;
        fcb(k, v);
    }

    const handleSortChange = (e) => {
        let k = e.target.name,
            v = Number(e.target.value);
        if (k != "key" && k != "order") return;
        scb(k, v);
    }

    return (
        <div className="navbar-nav">
            <div className="option_column nav-link">
                <div className="option_label">ソート設定</div>
                <div className="inline_radio">
                    <div className="inline_radio_col">
                        <select className='form-control form-select text-center' name="key" onChange={handleSortChange} >
                            <option value="0">デフォルト</option>
                            <option value="1">スコア差分</option>
                            <option value="2">レベル</option>
                        </select>
                    </div>
                    <div className="inline_radio_col">
                        <select className='form-control form-select text-center' name="order" onChange={handleSortChange} >
                            <option value="0">降順(デフォルト)</option>
                            <option value="1">昇順</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="option_column nav-link">
                <div className="option_label">非表示設定 (勝敗)</div>
                <div className="inline_radio">
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_1" value="0" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_1">Win</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_2" value="1" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_2">Draw</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_3" value="2" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_3">Lose</label>
                    </div>
                </div>
            </div>
            <div className="option_column nav-link">
                <div className="option_label">非表示設定2 (プレイ状況)</div>
                <div className="inline_radio">
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_4" value="3" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_4">未プレイ(自)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_5" value="4" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_5">未プレイ(相)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_6" value="5" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_6">未プレイ(両)</label>
                    </div>
                </div>
            </div>
            <div className="option_column nav-link">
                <div className="option_label">非表示設定3 (譜面種別)</div>
                <div className="inline_radio">
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_7" value="6" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_7">スタンダード</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_8" value="7" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_8">でらっくす</label>
                    </div>
                </div>
            </div>
            <div className="option_column nav-link">
                <div className="option_label">非表示設定4 (ランプ)</div>
                <div className="inline_radio">
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_9" value="8" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_9">AP+(自)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_10" value="9" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_10">AP(自)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_11" value="10" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_11">FC+(自)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_12" value="11" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_12">FC(自)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_13" value="12" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_13">未(自)</label>
                    </div>
                </div>
                <div className="inline_radio">
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_14" value="13" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_14">AP+(相)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_15" value="14" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_15">AP(相)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_16" value="15" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_16">FC+(相)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_17" value="16" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_17">FC(相)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_18" value="17" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_18">未(相)</label>
                    </div>
                </div>
            </div>
            <div className="option_column nav-link">
                <div className="option_label">非表示設定5 (ランプ2)</div>
                <div className="inline_radio">
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_19" value="18" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_19">FDX+(自)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_20" value="19" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_20">FDX(自)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_21" value="20" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_21">FS+(自)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_22" value="21" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_22">FS(自)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_23" value="22" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_23">未(自)</label>
                    </div>
                </div>
                <div className="inline_radio">
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_24" value="23" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_24">FDX+(相)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_25" value="24" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_25">FDX(相)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_26" value="25" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_26">FS+(相)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_27" value="26" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_27">FS(相)</label>
                    </div>
                    <div className="inline_radio_col">
                        <input type="checkbox" id="filter_val_28" value="27" onChange={handleFilterChange} />
                        <label htmlFor="filter_val_28">未(相)</label>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default NavBar;