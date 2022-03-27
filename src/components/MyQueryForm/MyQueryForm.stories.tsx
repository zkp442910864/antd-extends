import React, {FC} from 'react';
import {InputNumber, Form, Input} from 'antd';
import {ComponentStory, ComponentMeta, addParameters} from '@storybook/react';
import moment from 'moment';

import MyQueryForm, {MyQueryFormRef, TConfigType} from './MyQueryForm';
import {createTypeFn} from '../../stories/storybookUtils';
import {useStateDeep} from '../../utils';

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MyQueryForm> = (args) => <MyQueryForm {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
    config: [
        {
            type: 'input',
            vmodel: 'aaa1',
            label: '输入框',
        },
        {
            type: 'treeSelect',
            vmodel: 'aaa2',
            label: '树形选择',
            multiple: true,
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
        },
        {
            type: 'select',
            vmodel: 'aaa3',
            label: '选择框',
            options: [
                {title: 'asdf', value: 1},
                {title: 'asdf2', value: 2},
                {title: 'asdf3', value: 3},
            ],
            textKey: 'title',
            valueKey: 'value',
            clearable: true,
            showSearch: true,
        },
        {
            type: 'dateTimeRange',
            vmodel: ['aaa4', 'aaa5'],
            clearable: true,
            label: '时间选择',
            showFormat: 'YYYY-MM-DD HH:mm',
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
        },
        {
            type: 'groupSelectInput',
            vmodel: ['val1', 'val2'],
            label: '选择 + 输入',
            options: [
                {title: 'asdf', value: 1},
                {title: 'asdf2', value: 2},
                {title: 'asdf3', value: 3},
            ],
            textKey: 'title',
            valueKey: 'value',
            clearable: true,
            width: [80],
            itemWidth: '45%',
        },
        {
            type: 'groupSelectDateTimeRange',
            vmodel: ['val4', 'val5', 'val6'],
            label: '选择 + 时间',
            options: [
                {title: 'asdf', value: 1},
                {title: 'asdf2', value: 2},
                {title: 'asdf3', value: 3},
            ],
            textKey: 'title',
            clearable: true,
            valueKey: 'value',
            width: [80],
            itemWidth: '55%',
        },
    ],
    initParams: {
        aaa3: 1,
    },
    submitText: (<div>111</div>),
};
Primary.parameters = {
    description: {
        story: '123',
    },
};
Primary.storyName = '1.基础';

export const Input1 = Template.bind({});
Input1.args = {
    config: [
        {
            type: 'input',
            vmodel: 'aaa1',
            label: '输入框',
            maxLength: 10,
            change: (...q) => {console.log(...q);},
        },
    ],
};
Input1.storyName = '2.输入框';

export const Select1 = Template.bind({});
Select1.args = {
    config: [
        {
            type: 'select',
            vmodel: 'sdf3',
            label: '选择框',
            options: [
                {title: 'asdf', value: 1},
                {title: 'asdf2', value: 2},
                {title: 'asdf3', value: 3},
            ],
            textKey: 'title',
            valueKey: 'value',
            clearable: true,
            showSearch: true,
            multiple: true,
            change: (...q) => {console.log(...q);},
        },
        {
            type: 'select',
            vmodel: 'sdf4',
            clearable: true,
            label: '单选',
            options: [
                {title: 'asdf', value: 1},
                {title: 'asdf2', value: 2},
                {title: 'asdf3', value: 3},
            ],
            textKey: 'title',
            valueKey: 'value',
            showSearch: false,
            multiple: false,
            change: (...q) => {console.log(...q);},
        },
        {
            type: 'selectLoad',
            vmodel: 'selectLoad',
            label: '异步',
            textKey: 'title',
            valueKey: 'value',
            clearable: true,
            showSearch: true,
            multiple: true,
            change: (...q) => {console.log(...q);},
            requestApi: () => {
                return new Promise((rel) => {
                    setTimeout(() => {
                        rel({
                            data: [
                                {title: 'asdf', value: 1},
                                {title: 'asdf2', value: 2},
                                {title: 'asdf3', value: 3},
                            ],
                        });
                    }, 2000);
                });
            },
        },
    ],
};
Select1.storyName = '3.选择框';

export const TreeSelect1 = Template.bind({});
TreeSelect1.args = {
    config: [
        {
            type: 'treeSelect',
            vmodel: 'qweqwe',
            label: '选择',
            multiple: true,
            change: (...q) => {console.log(...q);},
            clearable: true,
            disabledRoot: true,
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
        },
        {
            type: 'treeSelect',
            vmodel: 'qweqweqweq',
            label: '数据',
            multiple: false,
            change: (...q) => {console.log(...q);},
            disabledRoot: false,
            clearable: true,
            dataField: {
                titleKey: 'ttt',
                childrenKey: 'ccc',
                valueKey: 'vvv',
            },
            treeOptions: [
                {
                    vvv: 1,
                    ttt: 1,
                    ccc: [
                        {
                            vvv: 2,
                            ttt: 2,
                            ccc: [],
                        },
                        {
                            vvv: 3,
                            ttt: 3,
                            ccc: [],
                        },
                    ],
                },
            ],
        },
        {
            type: 'treeSelect',
            vmodel: 'treeSelectRequest',
            label: '异步',
            change: (...q) => {console.log(...q);},
            multiple: true,
            requestApi: () => {
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
                    }, 2000);
                });
            },
        },
    ],
};
TreeSelect1.storyName = '4.树形选择';

export const DateTimeRange = Template.bind({});
DateTimeRange.args = {
    config: [
        {
            type: 'dateTimeRange',
            vmodel: ['date3', 'date4'],
            clearable: true,
            label: '日期',
            showFormat: 'YYYY-MM-DD ',
            dateFormat: 'YYYY-MM-DDTHH:mm:ss.sssZ',
            itemWidth: '50%',
        },
        {
            type: 'dateTimeRange',
            vmodel: ['date5', 'date6'],
            clearable: true,
            label: '日期 时间',
            showFormat: 'YYYY-MM-DD HH:mm',
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
            itemWidth: '50%',
        },
    ],
    initParams: {
        date3: '2021-01-02',
        date4: '2021-02-02',
        date5: moment(),
        date6: moment(),
    },
};
DateTimeRange.storyName = '5.时间选择';

export const GroupSelectInput = Template.bind({});
GroupSelectInput.args = {
    initParams: {
        val1: 1,
    },
    config: [
        {
            type: 'groupSelectInput',
            vmodel: ['val1', 'val2'],
            label: '',
            options: [
                {title: 'asdf', value: 1},
                {title: 'asdf2', value: 2},
                {title: 'asdf3', value: 3},
            ],
            textKey: 'title',
            valueKey: 'value',
            clearable: true,
            width: [100],
            itemWidth: '30%',
        },
    ],
};
GroupSelectInput.storyName = '6.选择+输入';

export const GroupSelectDateTimeRange = Template.bind({});
GroupSelectDateTimeRange.args = {
    compact: false,
    initParams: {
        val4: 1,
    },
    config: [
        {
            type: 'groupSelectDateTimeRange',
            vmodel: ['val4', 'val5', 'val6'],
            label: '123333',
            options: [
                {title: 'asdf', value: 1},
                {title: 'asdf2', value: 2},
                {title: 'asdf3', value: 3},
            ],
            textKey: 'title',
            clearable: false,
            valueKey: 'value',
            itemWidth: '60%',
            width: [100],
        },
    ],
};
GroupSelectDateTimeRange.storyName = '7.选择+时间';

export const Interposition = () => {
    return (
        <MyQueryForm
            btnLocal="rightBottom"
            compact={false}
            config={[
                {
                    type: 'custom',
                    render: (params) => {
                        return (
                            <Input value={params.ssss} onChange={(e) => (params.ssss = e.target.value)} />
                        );
                    },
                },
                {
                    type: 'groupSelectDateTimeRange',
                    vmodel: ['val4', 'val5', 'val6'],
                    label: '123333',
                    options: [
                        {title: 'asdf', value: 1},
                        {title: 'asdf2', value: 2},
                        {title: 'asdf3', value: 3},
                    ],
                    textKey: 'title',
                    clearable: false,
                    valueKey: 'value',
                    itemWidth: '60%',
                    width: [100],
                },
            ]}
            formItemAfterFn={(params) => {
                return (
                    <>
                        <Form.Item label="后面插入">
                            <InputNumber value={params.qweq} onChange={(e) => {params.qweq = e;}} />
                        </Form.Item>
                        <Form.Item>
                            <InputNumber value={params.eee} onChange={(e) => {params.eee = e;}} />
                        </Form.Item>
                    </>
                );
            }}
            formItemBeforeFn={(params) => {
                return (
                    <>
                        <Form.Item label="前面插入">
                            <InputNumber value={params.www} onChange={(e) => {params.www = e;}} />
                        </Form.Item>
                        <Form.Item>
                            <InputNumber value={params.eqqq} onChange={(e) => {params.eqqq = e;}} />
                        </Form.Item>
                    </>
                );
            }}
            initParams={{
                val4: 1,
                eee: 22,
            }}
            lastFn={() => {
                return (
                    <div>123</div>
                );
            }}
            onSubmit={(...arg) => console.log(arg)}
        />
    );
};
Interposition.storyName = '8.插入';

export const ICustom = Template.bind({});
ICustom.args = {
    config: [
        {
            type: 'custom',
            render: (params) => {
                return (
                    <Input value={params.ssss} onChange={(e) => (params.ssss = e.target.value)} />
                );
            },
        },
    ],
};
ICustom.storyName = '9.自定义内容';


export const TConfigTypeFn = createTypeFn<TConfigType>();
export const MyQueryFormRefFn = createTypeFn<MyQueryFormRef>();

export default {
    title: '组件/MyQueryForm(查询表单',
    component: MyQueryForm,
    parameters: {
        docs: {
            description: {
                // 描述内容，可以进行覆盖
                // component: '',
            },
            // page: () => {
            //     return (
            //         <>
            //             <Title />
            //             <Subtitle />
            //             <Description />
            //             <Primary />
            //             <ArgsTable story={PRIMARY_STORY} />
            //             <ArgsTable of={IConfigBaseFn} showComponent={false} />
            //             <Stories />
            //         </>
            //     );
            // },
        },
    },
    argTypes: {
        onSubmit: {action: 'clicked'},
        onReset: {action: 'clicked'},
    },
    subcomponents: {
        TConfigType: TConfigTypeFn,
        ref: MyQueryFormRefFn,
    },
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof MyQueryForm>;

