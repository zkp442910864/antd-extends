import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import AsyncSelect from './index';
import {useStateDeep} from '../../../../utils';

export default {
    title: '组件/MyQueryForm(查询表单/modules/AsyncSelect(选择框',
    component: AsyncSelect,
    parameters: {
        docs: {
            description: '',
        },
    },
} as ComponentMeta<typeof AsyncSelect>;

const Template: ComponentStory<typeof AsyncSelect> = (args) => <AsyncSelect {...args} />;

// export const Base = Template.bind({});
// Base.args = {
//     // primary: true,
//     // label: 'Button',
//     options: [
//         {title: '1', value: '1'},
//         {title: '2', value: '2'},
//         {title: '3', value: '3'},
//         {title: '4', value: '4'},
//     ],
// };

export const Base = () => {
    const state = useStateDeep({
        val: '1',
    });

    return (
        <AsyncSelect
            options={[
                {title: '1', value: '1'},
                {title: '2', value: '2'},
                {title: '3', value: '3'},
                {title: '4', value: '4'},
            ]}
            value={state.val}
            onChange={(v) => {
                state.val = v as string;
            }}
        />
    );
};
Base.storyName = '基础';

export const Load = () => {
    const state = useStateDeep({
        val: '',
    });

    return (
        <AsyncSelect
            dataType="load"
            requestApi={() => {
                return new Promise((rel) => {
                    setTimeout(() => {
                        rel({
                            data: [
                                {title: '1', value: '1'},
                                {title: '2', value: '2'},
                                {title: '3', value: '3'},
                                {title: '4', value: '4'},
                            ],
                        });
                    }, 1000);
                });
            }}
            value={state.val}
            onChange={(v) => {
                state.val = v as string;
            }}
        />
    );
};
Load.storyName = '异步数据';
