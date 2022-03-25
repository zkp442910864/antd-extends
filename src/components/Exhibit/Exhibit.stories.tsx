import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Button} from 'antd';
import {ButtonProps} from 'antd/lib/button/index';

import Exhibit from './Exhibit';
import {useStateDeep} from '../../utils';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Example/Exhibit(显示-隐藏',
    component: Exhibit,
    parameters: {
        docs: {
            description: {
                // 描述内容，可以进行覆盖
                component: '高阶函数中的 rShow 只有接受style，并且style作用于最外层才有效 <br> 注意传入的children 节点会被先编译，比如数据对象这些引用就会报错',
            },
        },
    },
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Exhibit>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Exhibit> = (args) => <Exhibit {...args}>123123</Exhibit>;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
};
Primary.storyName = '1.基础';



export const Package = () => {
    const NewButton = Exhibit.packComponent<ButtonProps>(Button);
    const state = useStateDeep({
        rIf: true,
        rShow: true,
    });

    return (
        <>
            <div>
                <Button type="ghost" onClick={() => {state.rIf = !state.rIf;}}>rIf</Button>
                <Button type="ghost" onClick={() => {state.rShow = !state.rShow;}}>rShow</Button>
            </div>
            <NewButton rIf={state.rIf} rShow={state.rShow} type="primary">123</NewButton>
        </>
    );
};
Package.storyName = '2.高阶函数使用';



// export const Secondary = Template.bind({});
// Secondary.args = {
//     label: 'Button',
// };

// export const Large = Template.bind({});
// Large.args = {
//     size: 'large',
//     label: 'Button',
// };

// export const Small = Template.bind({});
// Small.args = {
//     size: 'small',
//     label: 'Button',
// };
