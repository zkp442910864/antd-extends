import React, {useEffect} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {InputNumber, Checkbox} from 'antd';
// import {ButtonProps} from 'antd/lib/button/index';

import SmallParticle from './SmallParticle';
import MyModal, {createModalFn} from '../MyModal';
import MyTable from '../MyTable';
import Exhibit from '../Exhibit';
import AsyncSelect from '../MyQueryForm/modules/AsyncSelect';
import {useStateDeep, useStateDeepValue, jsCopy, emptyArray} from '../../utils';
import data1 from '../../fakeData/data1';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: '组件/SmallParticle(粒度缩小',
    component: SmallParticle,
    parameters: {
        docs: {
            description: {
                // 描述内容，可以进行覆盖
                component: '注意使用这个会产生副作用 Object.defineProperty, 不要在复杂场景中使用',
            },
        },
    },
} as ComponentMeta<typeof SmallParticle>;

const Template: ComponentStory<typeof SmallParticle> = (args) => <></>;

export const Primary = Template.bind({});
Primary.args = {
};
Primary.storyName = '1.基础';

export const Demo1 = () => {
    // eslint-disable-next-line react/no-unstable-nested-components
    const Demo = () => {

        const list = useStateDeepValue<any[]>([]);
        const state = useStateDeep({
            open: true,
            loading: false,
            other: {},
        });

        // 向上处理
        const handleParent = (item: any, fn: any) => {
            if (item.parent) {
                fn(item.parent);
                handleParent(item.parent, fn);
            }
        };

        // 向下处理
        const handleData = (list: any, fn: any, parent?: any) => {
            if (!Array.isArray(list)) return;
            list.forEach((item) => {
                fn(item, parent);
                Array.isArray(item.RegionalShippingViews) && handleData(item.RegionalShippingViews, fn, item);
            });
        };

        const getList = async () => {

            const res = jsCopy(data1);

            handleData(res.Countries, (item: any, parent: any) => {
                if (!Array.isArray(item.RegionalShippingViews) || !item.RegionalShippingViews.length) {
                    item.RegionalShippingViews = undefined;
                }
                if (parent) {
                    item.parent = parent;
                }
            });
            list.value = res.Countries;
            state.other = res.Template;
            console.log(list.value);

        };

        useEffect(() => {
            getList();
        }, []);

        return (
            <MyModal
                confirmLoading={state.loading}
                disabledHeight={true}
                title="123123"
                visible={state.open}
                width={1200}
                onCancel={() => {
                    state.open = false;
                }}
            >
                {({maxHeight}) => (
                    <MyTable
                        childrenColumnName="RegionalShippingViews"
                        columns={[
                            {
                                title: '1',
                                dataIndex: 'CountryName',
                                align: 'center',
                                width: '25%',
                            },
                            {
                                title: '2',
                                dataIndex: 'Type',
                                align: 'center',
                                width: '25%',
                                render: (text, record, index) => {
                                    return (
                                        <SmallParticle item={record} vmodel="Type">
                                            {(value, change) => (
                                                <AsyncSelect
                                                    options={[
                                                        {title: '1', value: 1},
                                                        {title: '2', value: 2},
                                                        {title: '3', value: 3},
                                                        {title: '4', value: 4},
                                                        {title: '5', value: 5},
                                                        {title: '6', value: 6},
                                                    ]}
                                                    style={{width: 182}}
                                                    value={value}
                                                    onChange={(e) => {
                                                        // console.log(e);
                                                        change(e);
                                                        // console.log(record.Type);

                                                        if ([1, 5].includes(record.Type)) {
                                                            record.ShippingPrice = '';
                                                            record.LocalShippingPrice = '';
                                                        } else if ([3, 4].includes(record.Type)) {
                                                            record.LocalShippingPrice = '';
                                                        }
                                                    }}
                                                />
                                            )}
                                        </SmallParticle>
                                    );
                                },
                            },
                            {
                                title: '3',
                                dataIndex: 'ShippingPrice',
                                width: '20%',
                                align: 'center',
                                render: (text, record, index) => {

                                    return (
                                        <div>
                                            <SmallParticle item={record} vmodel="ShippingPrice">
                                                {(value, change) => (
                                                    <InputNumber
                                                        disabled={[1, 5].includes(record.Type)}
                                                        max={9999.99}
                                                        min={0.01}
                                                        precision={2}
                                                        value={value}
                                                        onChange={change}
                                                    />
                                                )}
                                            </SmallParticle>
                                            <Exhibit rIf={record.Type === 4}>
                                                <span className="m-l-5">%</span>
                                            </Exhibit>
                                        </div>
                                    );
                                },
                            },
                            {
                                title: '4',
                                dataIndex: 'LocalShippingPrice',
                                align: 'center',
                                width: '20%',
                                render: (text, record, index) => {
                                    return (
                                        <div>
                                            {/* <InputNumber
                                                max={9999.99}
                                                min={0.01}
                                                precision={2}
                                                value={record.LocalShippingPrice}
                                                onChange={(e) => (record.LocalShippingPrice = e)}
                                            /> */}
                                            <SmallParticle item={record} vmodel="LocalShippingPrice">
                                                {(value, change) => (
                                                    <InputNumber
                                                        disabled={[1, 3, 4, 5].includes(record.Type)}
                                                        max={9999.99}
                                                        min={0.01}
                                                        precision={2}
                                                        value={value}
                                                        onChange={change}
                                                    />
                                                )}
                                            </SmallParticle>
                                            <Exhibit rIf={record.Type === 4}>
                                                <span className="m-l-5">%</span>
                                            </Exhibit>
                                        </div>
                                    );
                                },
                            },
                            {
                                title: (
                                    <div>
                                        5
                                        <Checkbox
                                            className="m-l-5"
                                            onChange={(e) => {
                                                // console.log(e);
                                                handleData(list.value, (item: any) => {
                                                // handleData(list.value, (item) => {
                                                    item.IsEnabled = e.target.checked;
                                                });
                                            }}
                                        />
                                    </div>
                                ),
                                dataIndex: 'IsEnabled',
                                align: 'center',
                                width: '20%',
                                render: (text, record, index, force) => {
                                    return (
                                        <SmallParticle item={record} vmodel="IsEnabled">
                                            {(value, change) => (
                                                <Checkbox
                                                    checked={value}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        // debugger;
                                                        change(checked);

                                                        // 处理下级
                                                        handleData(record.RegionalShippingViews, (item: any) => {
                                                            item.IsEnabled = checked;
                                                        });

                                                        // 处理上级
                                                        if (checked) {
                                                            handleParent(record, (item: any) => {
                                                                item.IsEnabled = true;
                                                            });
                                                        }

                                                        // console.log(list.value);

                                                    }}
                                                />
                                            )}
                                        </SmallParticle>
                                    );
                                },
                            },
                        ]}
                        // disabledPage={true}
                        expandIconColumnIndex={0}
                        // list={list.value}
                        list={list.value}
                        // rowKey="Id"
                        scroll={{y: maxHeight - 100}}
                    />
                )}
            </MyModal>
        );
    };

    const fn = createModalFn(Demo);

    return (
        <button onClick={() => fn()}>demo</button>
    );
};
Demo1.storyName = '2.性能优化';

export const Demo2 = () => {
    // eslint-disable-next-line react/no-unstable-nested-components
    const Demo = () => {

        const list = useStateDeepValue<any[]>([]);
        const state = useStateDeep({
            open: true,
            loading: false,
            other: {},
        });

        // 向上处理
        const handleParent = (item: any, fn: any) => {
            if (item.parent) {
                fn(item.parent);
                handleParent(item.parent, fn);
            }
        };

        // 向下处理
        const handleData = (list: any, fn: any, parent?: any) => {
            if (!Array.isArray(list)) return;
            list.forEach((item) => {
                fn(item, parent);
                Array.isArray(item.RegionalShippingViews) && handleData(item.RegionalShippingViews, fn, item);
            });
        };

        const getList = async () => {

            const res = jsCopy(data1);

            handleData(res.Countries, (item: any, parent: any) => {
                if (!Array.isArray(item.RegionalShippingViews) || !item.RegionalShippingViews.length) {
                    item.RegionalShippingViews = undefined;
                }
                if (parent) {
                    item.parent = parent;
                }
            });
            list.value = res.Countries;
            state.other = res.Template;

        };

        useEffect(() => {
            getList();
        }, []);

        return (
            <MyModal
                confirmLoading={state.loading}
                disabledHeight={true}
                title="123123"
                visible={state.open}
                width={1200}
                onCancel={() => {
                    state.open = false;
                }}
            >
                {({maxHeight}) => (
                    <MyTable
                        childrenColumnName="RegionalShippingViews"
                        columns={[
                            {
                                title: '1',
                                dataIndex: 'CountryName',
                                align: 'center',
                                width: '25%',
                            },
                            {
                                title: '2',
                                dataIndex: 'Type',
                                align: 'center',
                                width: '25%',
                                render: (text, record, index) => {

                                    return (
                                        <AsyncSelect
                                            options={[
                                                {title: '1', value: 1},
                                                {title: '2', value: 2},
                                                {title: '3', value: 3},
                                                {title: '4', value: 4},
                                                {title: '5', value: 5},
                                                {title: '6', value: 6},
                                            ]}
                                            style={{width: 182}}
                                            value={record.Type}
                                            onChange={(e) => {
                                                record.Type = e;

                                                if ([1, 5].includes(record.Type)) {
                                                    record.ShippingPrice = '';
                                                    record.LocalShippingPrice = '';
                                                } else if ([3, 4].includes(record.Type)) {
                                                    record.LocalShippingPrice = '';
                                                }

                                                list.value = [...list.value!];
                                            }}
                                        />
                                    );
                                },
                            },
                            {
                                title: '3',
                                dataIndex: 'ShippingPrice',
                                width: '20%',
                                align: 'center',
                                render: (text, record, index) => {

                                    return (
                                        <div>
                                            <InputNumber
                                                disabled={[1, 5].includes(record.Type)}
                                                max={9999.99}
                                                min={0.01}
                                                precision={2}
                                                value={record.ShippingPrice}
                                                onChange={(e) => {
                                                    record.ShippingPrice = e;
                                                    list.value = [...list.value!];
                                                }}
                                            />
                                            <Exhibit rIf={record.Type === 4}>
                                                <span className="m-l-5">%</span>
                                            </Exhibit>
                                        </div>
                                    );
                                },
                            },
                            {
                                title: '4',
                                dataIndex: 'LocalShippingPrice',
                                align: 'center',
                                width: '20%',
                                render: (text, record, index) => {
                                    return (
                                        <div>
                                            <InputNumber
                                                disabled={[1, 3, 4, 5].includes(record.Type)}
                                                max={9999.99}
                                                min={0.01}
                                                precision={2}
                                                value={record.LocalShippingPrice}
                                                onChange={(e) => {
                                                    record.LocalShippingPrice = e;
                                                    list.value = [...list.value!];
                                                }}
                                            />
                                            <Exhibit rIf={record.Type === 4}>
                                                <span className="m-l-5">%</span>
                                            </Exhibit>
                                        </div>
                                    );
                                },
                            },
                            {
                                title: (
                                    <div>
                                        5
                                        <Checkbox
                                            className="m-l-5"
                                            onChange={(e) => {
                                                handleData(list.value, (item: any) => {
                                                    item.IsEnabled = e.target.checked;
                                                });

                                                list.value = [...list.value!];

                                            }}
                                        />
                                    </div>
                                ),
                                dataIndex: 'IsEnabled',
                                align: 'center',
                                width: '20%',
                                render: (text, record, index, force) => {
                                    return (
                                        <Checkbox
                                            checked={record.IsEnabled}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                // debugger;
                                                record.IsEnabled = checked;

                                                // 处理下级
                                                handleData(record.RegionalShippingViews, (item: any) => {
                                                    item.IsEnabled = checked;
                                                });

                                                // 处理上级
                                                if (checked) {
                                                    handleParent(record, (item: any) => {
                                                        item.IsEnabled = true;
                                                    });
                                                }

                                                list.value = [...list.value!];
                                            }}
                                        />
                                    );
                                },
                            },
                        ]}
                        // disabledPage={true}
                        expandIconColumnIndex={0}
                        // list={list.value}
                        list={list.value}
                        // rowKey="Id"
                        scroll={{y: maxHeight - 100}}
                    />
                )}
            </MyModal>
        );
    };

    const fn = createModalFn(Demo);

    return (
        <button onClick={() => fn()}>demo</button>
    );
};
Demo2.storyName = '3.未优化';
