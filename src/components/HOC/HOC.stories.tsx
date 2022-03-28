import React, {useEffect, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Spin} from 'antd';
// import {} from '@storybook/addon-docs';

import {spinHoc} from './index';

export default {
    title: '组件/HOC(高阶函数',
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
        <>test</>
    );
};
Base.storyName = '.';

const Test = (props: any) => {
    return (
        <div>{props.children}222</div>
    );
};

export const SpinHoc = () => {
    const NewCom2 = spinHoc(Test, {indicator: <></>}, 'out');
    const NewCom = spinHoc(Test, {indicator: <></>}, 'inline');

    return (
        <div>
            <NewCom2 spinning={true} />
            <NewCom indicator={undefined} spinning={true}>
                333
            </NewCom>
        </div>
    );
};
SpinHoc.storyName = '1.spinHoc';
SpinHoc.parameters = {
    docs: {
        description: {
            story: 'loading 框的高阶函数' +
                '<br/> 注意：别滥用了，会增加dom层级' +
                '<br/> type 区分两种情况' +
                '<br/> 1.\\<Com>\\<Spin/></Com> (inline 这种情况处理不好，会有问题，主要看children处理，比较适合使用在容器上)' +
                '<br/> 2.\\<Spin>\\<Com/></Spin> (out)' +
                '<br/>  \\<T extends TObj = TObj\\>(Com: any, defaultProps?: SpinProps, type?: \'inline\' | \'out\') => React.FC\\<T & SpinProps\\>',
        },
    },
};