import React, {useEffect, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Spin} from 'antd';
// import {} from '@storybook/addon-docs';

import {jsCopy, empty, sleep, throttleDebounce} from './index';

export default {
    title: '工具/其它',
    // component: Button,
    parameters: {
        docs: {
            description: {
                // 描述内容，可以进行覆盖
                component: '功能封装',
            },
        },
    },
};


export const Base = () => {
    return (
        <></>
    );
};
Base.storyName = '.';

export const JsCopy = () => {

    const obj = {
        a: [{w: 2}],
        dd: {
            s: {
                e: new Date(),
            },
        },
    };

    const click = () => {
        const newData = jsCopy(obj);

        console.log(obj);
        console.log(newData);
        console.log(obj.dd.s.e === newData.dd.s.e);
    };

    return (
        <div>
            <button onClick={click}>点击</button>
        </div>
    );
};
JsCopy.storyName = '1.jsCopy';
JsCopy.parameters = {
    docs: {
        description: {
            story: '深拷贝',
        },
    },
};

export const Empty = () => {

    const obj = {
        a: [{w: 2}],
        dd: {
            s: {
                e: new Date(),
            },
        },
    };

    const click = () => {
        console.log(empty(''));
        console.log(empty(null));
        console.log(empty(undefined));
        console.log(empty(0));
    };

    return (
        <div>
            <button onClick={click}>点击</button>
        </div>
    );
};
Empty.storyName = '2.empty';
Empty.parameters = {
    docs: {
        description: {
            story: '判空 以下数据都为空 \'\'|null|undefined',
        },
    },
};

export const Sleep = () => {

    const click = async () => {
        console.log(1);
        await sleep(1000);
        console.log(2);
    };

    return (
        <div>
            <button onClick={click}>点击</button>
        </div>
    );

};
Sleep.storyName = '3.sleep';
Sleep.parameters = {
    docs: {
        description: {
            story: '利用async/await 的特性,封装的睡眠函数',
        },
    },
};

export const ThrottleDebounce = () => {

    const click = throttleDebounce(() => {
        console.log(1);
    }, 1000);

    return (
        <div>
            <button onClick={click}>点击</button>
        </div>
    );

};
ThrottleDebounce.storyName = '4.throttleDebounce';
ThrottleDebounce.parameters = {
    docs: {
        description: {
            story: '结合 节流和防抖 的特性, 组合出的功能',
        },
    },
};

