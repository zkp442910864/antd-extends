import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import InputTrim from './index';
import {useStateDeep} from '../../../../utils';

export default {
    title: '组件/MyQueryForm(查询表单/modules/InputTrim(去除前后空格',
    component: InputTrim,
    parameters: {
        docs: {
            description: '',
        },
    },
} as ComponentMeta<typeof InputTrim>;

const Template: ComponentStory<typeof InputTrim> = (args) => <InputTrim {...args} />;

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
        <InputTrim
            value={state.val}
            onChange={(e) => {
                state.val = e || '';
                console.log(state.val.replaceAll(' ', '1'));
            }}
        />
    );
};
Base.storyName = '基础';
