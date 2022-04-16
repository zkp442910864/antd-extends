import React, {FC, useEffect, useState, createRef, useRef} from 'react';
import {Select, Input, InputNumber} from 'antd';

import {AsyncTreeSelect, AsyncSelect, MyTable, renderSelectionCellFn, spinHoc, SmallParticle} from '@/components';
// import MyQueryForm from '@/components/MyQueryForm';
// import MyModal, {createModalFn} from '@/components/MyModal';
import {useStateDeep, jsCopy, useStateDeepValue} from '@/utils';
import {deepProxy, deepProxy2} from '@/utils/modules/deepProxy';

import {aaFn} from './test';
import * as All from '../tsc';

global.All = All;

// const testData2 = deepProxy2<any[]>([]);
// const testData2 = deepProxy<any[]>([]);
// window.testData2 = testData2;
const Home: FC = (props) => {

    const testData = useStateDeepValue<any[]>([]);
    const state = useStateDeep({
        hide: false,
        open: false,
        selectItems: [] as any[],
        list: (() => {
            const arr = [];
            for (let index = 0; index < 20; index++) {
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
                    children: [{age: 'qwe' + index}, {age: 'qwe2' + index}],
                });
            }

            return arr;
        })(),
    });

    const addd = () => {
        console.time('a');

        const data = (() => {
            const arr = [];
            for (let index = 0; index < 100; index++) {
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
                    children: [{age: 'qwe' + index}, {age: 'qwe2' + index}],
                });
            }

            return arr;
        })();

        // state.list = [...state.list, ...data];
        state.list.push(...data);
        // testData2.push(...data);
        // testData.value.push(...data);

        console.timeEnd('a');
    };

    const addd2 = () => {
        state.list.forEach((item) => {
            // item.age = 333;
            Object.assign(item, {
                age: 333,
                name: '1111',
            });
        });
    };

    console.log('update', state);

    return (
        <div className="bbb bbb2">
            {/* <div className="bbbbb">123</div> */}
            <div
                onClick={async () => {
                    const data = await aaFn();
                    console.log(data);
                    state.list.push(...data);
                }}
            >
                123
            </div>
            <div onClick={() => addd()}>
                123
            </div>
            <div onClick={() => addd2()}>
                123
            </div>
            <MyTable
                autoSelectChild={true}
                columns={[
                    {title: 'Name', dataIndex: 'name'},
                    {title: 'Age', dataIndex: 'age'},
                    {
                        title: '操作',
                        dataIndex: 'operation',
                        render (text, item, index, forceUpdate) {
                            // console.log(text, index, forceUpdate);

                            return (
                                <>
                                    {/* {
                                        (item.qq ? item.list : item.list?.slice?.(0, 1))?.map?.((item: any) => {
                                            return (
                                                <div key={item.key}>{item.aa}</div>
                                            );
                                        })
                                    } */}
                                    <div
                                        onClick={() => {
                                            item.qq = !item.qq;
                                            // console.log(forceUpdate);
                                            forceUpdate();
                                        }}
                                    >
                                        k
                                    </div>
                                    <div>
                                        <Input
                                            value={item.g2}
                                            onChange={(e) => {
                                                console.log(e.target.value);
                                                item.g2 = e.target.value;
                                            }}
                                        />
                                        <SmallParticle
                                            item={item}
                                            vmodel="g"
                                        >
                                            {(value, change) => (
                                                <InputNumber
                                                    max={100}
                                                    min={1}
                                                    precision={2}
                                                    value={value}
                                                    onChange={(e) => {
                                                        change(e);
                                                    }}
                                                />
                                            )}
                                        </SmallParticle>
                                    </div>
                                </>
                            );
                        },
                    },
                ]}
                components={{
                    body: {
                        // row: (props) => {
                        //     // console.log(props);
                        //     return <tr {...props} />;
                        // },
                        cell: renderSelectionCellFn(({checkbox, expand}, item) => {
                            // console.log(item);
                            return (
                                <div>
                                    {checkbox}
                                    {expand}
                                    333
                                </div>
                            );
                        }),
                    },
                }}
                defaultSort={{field: 'asd', order: 0}}
                // disabledPage={true}
                // expandedRowRender={() => {
                //     return (
                //         <div>123</div>
                //     );
                // }}
                // 只有在展开 children 时候才有效果
                expandIcon={({expanded, onExpand, record}) => {
                    const isChildren = Array.isArray(record.children);
                    if (!isChildren) return undefined;
                    return expanded
                        ? <div onClick={e => onExpand(record, e)}>收缩</div>
                        : <div onClick={e => onExpand(record, e)}>展开</div>;
                }}
                expandIconColumnIndex={0}
                list={state.list}
                // rowKey={item => item.age}
                rowSelectChange={(ids, items) => {
                    console.log(items);
                    state.selectItems = items;
                }}
                // scroll={{y: 500}}
                showTopDiv={true}
            />
        </div>
    );
};

export default Home;

