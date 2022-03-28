import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import NumberRang from './index';
import {useStateDeep} from '../../../../utils';

export default {
    title: '组件/MyQueryForm(查询表单/modules/NumberRang(范围输入',
    component: NumberRang,
    parameters: {
        docs: {
            description: '',
        },
    },
} as ComponentMeta<typeof NumberRang>;

const Template: ComponentStory<typeof NumberRang> = (args) => <NumberRang {...args} />;

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
        val: '1' as string | number | undefined,
        val2: '2' as string | number | undefined,
    });

    return (
        <NumberRang
            maxValue={state.val2}
            minValue={state.val}
            onChange={(min, max) => {
                console.log(min, max);

                state.val = min;
                state.val2 = max;
            }}
        />
    );
};
Base.storyName = '基础';
