import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import AsyncTreeSelect from './index';
import {useStateDeep} from '../../../../utils';

export default {
    title: '组件/MyQueryForm(查询表单/modules/AsyncTreeSelect(树形选择',
    component: AsyncTreeSelect,
    parameters: {
        docs: {
            description: '',
        },
    },
} as ComponentMeta<typeof AsyncTreeSelect>;

const Template: ComponentStory<typeof AsyncTreeSelect> = (args) => <AsyncTreeSelect {...args} />;

export const Base = Template.bind({});
Base.storyName = '基础';
Base.args = {
    // primary: true,
    // label: 'Button',
    value: 1,
    treeOptions: [
        {
            value: 1,
            title: 1,
            children: [
                {
                    value: 2,
                    title: 2,
                    children: [],
                },
                {
                    value: 3,
                    title: 3,
                    children: [],
                },
            ],
        },
    ],
    // onChange (key, item) {
    //     Base.args.value = key;
    //     console.log(Base.args);
    // },
};
Base.argTypes = {
    onChange: {
        action: 'change',
    },
};


export const Load = () => {
    const state = useStateDeep({
        val: [],
    });

    return (
        <AsyncTreeSelect
            multiple={true}
            requestApi={() => {
                return new Promise((rel) => {
                    setTimeout(() => {
                        rel({
                            data: [
                                {
                                    value: 1,
                                    title: 1,
                                    children: [
                                        {
                                            value: 2,
                                            title: 2,
                                            children: [],
                                        },
                                        {
                                            value: 3,
                                            title: 3,
                                            children: [],
                                        },
                                    ],
                                },
                            ],
                        });
                    }, 1000);
                });
            }}
            value={state.val}
            onChange={(v) => {
                state.val = v as [];
            }}
        />
    );
};
Load.storyName = '异步数据';
