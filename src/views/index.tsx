import React, {FC, useEffect, useState} from 'react';
import {Select} from 'antd';

// import {AsyncTreeSelect, AsyncSelect} from '@/components';
// import MyQueryForm from '@/components/MyQueryForm';
// import MyModal, {createModalFn} from '@/components/MyModal';
import {useStateDeep, jsCopy} from '@/utils';

// import './index.scoped.less';


const Home: FC = (props) => {

    const state = useStateDeep({
        hide: false,
        open: false,
    });

    return (
        <div className="bbb bbb2">
            {/* <div className="bbbbb">123</div> */}
            <div className="bbb">
                123
            </div>
        </div>
    );
};

export default Home;

