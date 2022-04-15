import React, {useEffect, useCallback, useMemo, useState, memo} from 'react';
import PropTypes from 'prop-types';
import {Form, Radio, Input, InputNumber, Checkbox} from 'antd';

import rawData from '@/fakeData/data1';

import {MyModal, createModalFn, useStateDeep, MyTable, useStateDeepValue, AsyncSelect, Exhibit, emptyArray, SmallParticle, jsCopy} from '../tsc';


// const lazyRow = useCallback(lazyRowFun(51), []);
const Aa = ({
    afterClose,
    yes,
    no,
}) => {

    const list = useStateDeepValue<any[]>([]);
    const state = useStateDeep({
        open: true,
        loading: false,
        other: {},
        list: (() => {
            const arr = [];
            for (let index = 0; index < 1; index++) {
                arr.push({
                    name: 'John Brown',
                    age: index,
                    qwe: 'New York No. 1 Lake Park',
                    list: [
                        {key: 1, aa: 2},
                        {key: 3, aa: 4},
                    ],
                    asdad: {a: 1},
                    asdad2: [{a: 1}],
                    g: 1,
                    children: [{age: 'qwe' + index}],
                });
            }

            return arr;
        })(),
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

        const res = jsCopy(rawData);

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
            afterClose={afterClose}
            confirmLoading={state.loading}
            disabledHeight={true}
            title="123123"
            visible={state.open}
            width={1200}
            onCancel={() => {
                state.open = false;
                no();
            }}
            onOk={() => {
                state.open = false;
                yes(state.list);
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
                                const isChild = emptyArray(record.RegionalShippingViews);

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
                                                    record.Type = e;
                                                    change(e);

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
                    disabledPage={true}
                    expandIconColumnIndex={0}
                    // list={list.value}
                    list={state.list}
                    rowKey="Id"
                    scroll={{y: maxHeight - 100}}
                />
            )}
        </MyModal>
    );
};

export const aaFn = createModalFn(Aa);


