import React, {useEffect, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {InputNumber} from 'antd';
// import {} from '@storybook/addon-docs';

import {toast, promptFn} from './index';
import {sleep} from '../utils';

export default {
    title: '组件-函数调用',
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


export const Toast = () => {

    const click = () => {
        toast('1', 1);
        toast('2', 2);
        toast('3', 3);
        toast('默认');
    };

    return (
        <div>
            <button onClick={click}>点击</button>
        </div>
    );
};
Toast.storyName = '1.toast';
Toast.parameters = {
    docs: {
        description: {
            story: 'toast 若提示',
        },
    },
};

export const PromptFn = () => {

    const click = async () => {
        const data = await promptFn();
        console.log(data);
    };

    const click2 = async () => {
        const data = await promptFn({
            // title: 'qwe',
            // closable: true,
            loadingDisableClose: true,
            customJSX: (value, change, ref) => {
                return (
                    <InputNumber
                        ref={ref}
                        style={{width: '100%'}}
                        value={value}
                        onChange={(e) => change(e)}
                    />
                    // <div>12312</div>
                );
            },
            customFn: async () => {
                // toast(123123, 2);
                // return Promise.reject();

                await sleep(10000);
                return 11;
            },
        });
        console.log(data);
    };

    const click3 = async () => {
        const data = await promptFn({
            title: 'qwe',
            // closable: true,
            loadingDisableClose: true,
            customJSX: (value, change) => {
                return (
                    // <InputNumber style={{width: '100%'}} value={value} onChange={(e) => change(e)} />
                    <div>是否xxxx</div>
                );
            },
            customFn: async () => {
                // toast(123123, 2);
                // return Promise.reject();

                await sleep(10000);
                toast('错了', 2);
                return Promise.reject();
            },
        });
        console.log(data);
    };

    return (
        <div>
            <button onClick={click}>点击</button>
            <button onClick={click2}>自定义</button>
            <button onClick={click3}>自定义</button>
        </div>
    );
};
PromptFn.storyName = '2.promptFn';
PromptFn.parameters = {
    docs: {
        description: {
            story: '同 window.prompt 的效果，不过是利用异步实现',
        },
    },
};