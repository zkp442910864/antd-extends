import React, {FC, useEffect, useState, createRef} from 'react';
import {Select, Input, InputNumber} from 'antd';

import {AsyncTreeSelect, AsyncSelect, MyTable, renderSelectionCellFn, spinHoc, SmallParticle} from '@/components';
// import MyQueryForm from '@/components/MyQueryForm';
// import MyModal, {createModalFn} from '@/components/MyModal';
import {useStateDeep, jsCopy} from '@/utils';

import {aaFn} from './test';
import * as All from '../tsc';

global.All = All;


const Home: FC = (props) => {

    const state = useStateDeep({
        hide: false,
        open: false,
        selectItems: [] as any[],
        list: (() => {
            const arr = [];
            for (let index = 0; index < 200; index++) {
                arr.push({
                    name: 'John Brown',
                    age: index,
                    qwe: 'New York No. 1 Lake Park',
                    list: [
                        {key: 1, aa: 2},
                        {key: 3, aa: 4},
                    ],
                    g: 1,
                    children: [{age: 'qwe' + index}],
                });
            }

            return arr;
        })(),
    });

    // console.log(state.list);

    return (
        <div className="bbb bbb2">
            {/* <div className="bbbbb">123</div> */}
            <div onClick={() => aaFn()}>
                123
            </div>
            <MyTable
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
                                    {
                                        (item.qq ? item.list : item.list?.slice?.(0, 1))?.map?.((item: any) => {
                                            return (
                                                <div key={item.key}>{item.aa}</div>
                                            );
                                        })
                                    }
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
                                        {/* <input
                                            value={item.g}
                                            onChange={(e) => {
                                                console.log(e.target.value);
                                                item.g = e.target.value;
                                            }}
                                        /> */}
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
                rowSelectChange={(ids, items) => {state.selectItems = items;}}
                // scroll={{y: 500}}
                showTopDiv={true}
            />
        </div>
    );
};

export default Home;

