import React from 'react';
import PlayersInfo from './players_info';
import NavBar from "./nav_bar"
import SongBox from "./score_box"

export default class Body extends React.Component {
    constructor(arg) {
        super(arg);
        this.state = {
            disp_count: 0,
            filter: [],
            favorite: this.isFav(),
            sort: {
                key: 0,   // ソート基準
                order: 0  // 昇降順
            },
        };
        this.handleFilterCallback = this.handleFilterCallback.bind(this);
        this.handleSortCallback = this.handleSortCallback.bind(this);
        this.getDispCount = this.getDispCount.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
    }

    handleFilterCallback(k, v) {
        let filter = this.state.filter,
            _filter = v ? [...filter, k] : filter.filter(n => n !== k);
        this.setState({ filter: _filter });
    }

    handleSortCallback(k, v) {
        let _sort = this.state.sort;
        _sort[k] = v;
        this.setState({ sort: _sort });
    }

    getDispCount() {
        this.setState({ disp_count: document.querySelectorAll("div.score_box:not(.d-none)").length });
    }

    handleChangeInput() {
        let i = document.body.dataset.id,
            l = localStorage.getItem("regist_list"),
            v = !l ? [] : JSON.parse(l),
            f = !this.state.favorite,
            r = f ? [...v, i] : v.filter((e) => e !== i);
        this.setState({ favorite: f });
        localStorage.setItem("regist_list", JSON.stringify(r));
    }

    isFav() {
        let i = document.body.dataset.id,
            l = localStorage.getItem("regist_list"),
            v = !l ? [] : JSON.parse(l);
        return v.includes(i);
    }

    render() {
        return (
            <>
                <nav className="top_nav_bar navbar navbar-light bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">maimai-fve</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div id="navbar" className="collapse navbar-collapse">
                            <NavBar fcb={this.handleFilterCallback} scb={this.handleSortCallback} />
                        </div>
                    </div>
                </nav>
                <div className="container">
                    <div className="players_info_box accordion">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button className="accordion-button players_info_label" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    ユーザー情報
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne">
                                <div className="accordion-body">
                                    {<PlayersInfo self_name={this.props.header[0]} self_rate={this.props.header[1]} rival_name={this.props.header[2]} rival_rate={this.props.header[3]} />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="score_box">
                        <div className="score_box_middle text-center">{`カテゴリ: ${this.props.header[4]}/${this.props.header[5]}/${this.props.header[6]}`}</div>
                        <div className="score_box_footer text-center">{`取得時間: ${this.props.timestamp}`}</div>
                    </div>
                    <div id="music_list">
                        <SongBox body={this.props.body} filter={this.state.filter} sort={this.state.sort} />
                    </div>
                    <nav className='bottom_nav_bar navbar bg-light'>
                        <div className='container-fluid'>
                            <div className='favorite' data-checked={this.state.favorite} onClick={this.handleChangeInput}>登録</div>
                            <a className='backward_list' href="/view">リストに移動</a>
                            <div className='pagetop' onClick={() => window.scrollTo(0, 0)}></div>
                        </div>
                    </nav>
                </div>
            </>
        );
    }
}