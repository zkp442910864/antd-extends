import React, {FC, useEffect, useState, createRef} from 'react';
import {Select} from 'antd';

import {AsyncTreeSelect, AsyncSelect, MyTable, renderSelectionCellFn, spinHoc, Exhibit} from '@/components';
// import MyQueryForm from '@/components/MyQueryForm';
// import MyModal, {createModalFn} from '@/components/MyModal';
import {useStateDeep, jsCopy} from '@/utils';

import * as All from '../tsc';

global.All = All;

const Home2 = (props: any) => {

    const dataList = (() => {
        const arr = [];
        for (let index = 0; index < 36; index++) {
            arr.push({
                name: `John Brown ${index}`,
                age: index,
                children: [{name: `John Brown ${index}`, age: index + 100}],
                list: [{aa: 6}, {aa: 5}, {aa: 4}, {aa: 3}, {aa: 2}, {aa: 1}],
            });
        }

        return arr;
    })();
    const myTable = createRef<any>();

    // 配合查询表单组件使用
    const getFormData = () => {
        return {
            a: 2,
            b: 3,
        };
    };

    const requestApi = (params: any) => {
        // console.log(params);
        return new Promise<any>((resolve, reject) => {
            setTimeout(() => {
                const arr = dataList.slice(
                    0 + ((params.current - 1) * params.pageSize),
                    params.pageSize + ((params.current - 1) * params.pageSize),
                );

                // debugger;
                // console.log(arr);
                resolve({
                    data: {
                        list: arr,
                        pagination: {
                            pageSizeOptions: [20],
                            pageSize: params.pageSize,
                            current: params.current,
                            total: dataList.length,
                        },
                    },
                });
            }, 2000);
        });
    };


    return (
        <div {...props}>
            <button
                onClick={() => {
                    console.log(myTable.current);
                    myTable.current!.getList(1);
                }}
            >
                搜索
            </button>
            <button onClick={() => {myTable.current!.clearList();}}>重置</button>

            <MyTable
                // autoRowKey={false}
                autoSelectChild={true}
                childrenColumnName="children"
                columns={[
                    {title: 'Name', dataIndex: 'name'},
                    {title: 'Age', dataIndex: 'age'},
                ]}
                defaultSort={{field: 'asd', order: 0}}
                // expandedRowKeys={[0]}
                expandIconColumnIndex={0}
                list={dataList}
                // getFormData={getFormData}
                ref={myTable}
                // lockHead={true}
                // requestApi={requestApi}
                rowKey={item => item.age}
                rowSelectChange={(keys, rows) => {
                    console.log(keys, rows);
                }}
            // scroll={{y: 500}}
            // showTopDiv={false}
            />
        </div>
    );
};


const NewHome2 = Exhibit.packComponent(Home2);
const Home: FC = (props) => {

    const state = useStateDeep({
        hide: false,
        open: false,
        selectItems: [] as any[],
        list: (() => {
            const arr = [];
            for (let index = 0; index < 36; index++) {
                arr.push({name: 'John Brown', age: index, qwe: 'New York No. 1 Lake Park', children: [{age: 'qwe' + index}]});
            }

            return arr;
        })(),
    });

    return (
        <div className="bbb bbb2">
            <NewHome2 rShow={false} />
            {/* <div className="bbbbb">123</div> */}
            <MyTable
                columns={[
                    {title: 'Name', dataIndex: 'name'},
                    {title: 'Age', dataIndex: 'age'},
                    {
                        title: '操作',
                        dataIndex: 'operation',
                        render (text, item, index, forceUpdate) {

                            return (
                                <>
                                    {/* {
                                        (item.qq ? item.list : item.list?.slice?.(0, 1))?.map?.((item: TObj) => {
                                            return (
                                                <div key={item.key}>{item.aa}</div>
                                            );
                                        })
                                    } */}
                                    <div
                                        onClick={() => {
                                            item.qq = true;
                                            // console.log(item);
                                            forceUpdate();
                                        }}
                                    >
                                        k
                                    </div>
                                    <div onClick={() => (item.qq = false)}>g</div>
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
                                    <div>123123</div>
                                </div>
                            );
                        }),
                        // cell: (props) => {
                        //     if (props.className.includes('ant-table-selection-column')) {
                        //         // 重新渲染选择框
                        //         const {
                        //             children,
                        //             ...otherProps
                        //         } = props;
                        //         const [placeholder, expand, checkbox] = children;
                        //         console.log(checkbox._owner.pendingProps.record);
                        //         // console.log(otherProps);
                        //         return (
                        //             <td {...otherProps}>
                        //                 {checkbox}
                        //                 {expand}
                        //             </td>
                        //         );
                        //     }
                        //     return <td {...props} />;
                        // },
                    },
                }}
                defaultSort={{field: 'asd', order: 0}}
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

