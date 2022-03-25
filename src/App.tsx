import React from 'react';
import ReactDom from 'react-dom';
import 'antd/dist/antd.css';

import Component from './views';

export default () => {
    // 主入口
    const Main = () => {

        return (
            <Component />
        );
    };


    ReactDom.render(<Main />, document.getElementById('root'));
};
