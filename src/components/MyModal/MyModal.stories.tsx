import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Select} from 'antd';
// import {ButtonProps} from 'antd/lib/button/index';

import MyModal from './MyModal';
import {createModalFn} from './modules/createModalFn';
import {useStateDeep} from '../../utils';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: '组件/MyModal(弹窗',
    component: MyModal,
    parameters: {
        // componentSubtitle: '使用方式和 antd Modal 一样',
        docs: {
            description: {
                // 描述内容，可以进行覆盖
                component: '使用方式和 antd Modal 一样, 扩展了部分属性而已',
            },
        },
    },
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof MyModal>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MyModal> = (args) => <></>;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
    // visible: false,
};
Primary.storyName = '1.基础';


export const Follow = () => {
    const state = useStateDeep({
        open: false,
    });

    return (
        <>
            <div>
                <button onClick={() => {state.open = true;}}>打开</button>
            </div>
            <MyModal
                childFooter={() => {
                    return (
                        <div>底</div>
                    );
                }}
                childRight={() => {
                    return (
                        <div>右</div>
                    );
                }}
                maskClosable={false}
                title="123"
                visible={state.open}
                width={600}
                onCancel={() => {state.open = false;}}
            >
                <Select>
                    <Select.Option key={1}>1</Select.Option>
                    <Select.Option key={2}>2</Select.Option>
                    <Select.Option key={3}>3</Select.Option>
                </Select>
                <div style={{height: '800px'}}> 123123123 </div>
                {/* <div style={{height: '800px'}}> 123123123 </div> */}
                <div> 123123123 </div>
                <div> 123123123 </div>
                <div> 123123123 </div>
            </MyModal>
        </>
    );
};
Follow.storyName = '2.弹出框跟随';

export const Package = () => {

    // 弹窗组件, 即用即销
    // eslint-disable-next-line react/no-unstable-nested-components
    const Tt = (props: any) => {
        const {
            afterClose,
            yes,
            no,
        } = props;
        const state = useStateDeep({
            open: true,
        });

        return (
            <MyModal
                afterClose={afterClose}
                maskClosable={false}
                title="123"
                visible={state.open}
                width={600}
                onCancel={() => {
                    state.open = false;
                    no({cc: 3});
                }}
                onOk={() => {
                    state.open = false;
                    yes({a: 123});
                }}
            >
                <div style={{height: '800px'}}> 123123123 </div>
                <Select>
                    <Select.Option key={1}>1</Select.Option>
                    <Select.Option key={2}>2</Select.Option>
                    <Select.Option key={3}>3</Select.Option>
                </Select>
                {/* <div style={{height: '800px'}}> 123123123 </div> */}
                <div> 123123123 </div>
                <div> 123123123 </div>
                <div> 123123123 </div>
            </MyModal>
        );
    };

    const newTtFn = createModalFn(Tt);

    return (
        <>
            <div>
                <button
                    onClick={async () => {
                        const r = await newTtFn({});
                        console.log(r);
                    }}
                >
                    打开
                </button>
            </div>
        </>
    );
};
Package.storyName = '3.函数方式使用';



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
