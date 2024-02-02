import React from 'react';
import ListBox from "./list";

const Body = (({body}) => {
    return (
        <>
            <div className="container">
                <h2 className='label'>登録リスト</h2>
                <ListBox body={body} />
                <div className='pagetop' onClick={() => window.scrollTo(0, 0)}></div>
            </div>
        </>
    );
});

export default Body;