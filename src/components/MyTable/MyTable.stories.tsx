import React, {createRef, useRef} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {useStateDeep} from '../../utils';
import {createTypeFn} from '../../stories/storybookUtils';
import MyTable, {TableRef, IColumn} from './MyTable';
import {TObj} from './MyTable.type';


// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MyTable> = (args) => {
    // console.log(args);
    return (
        <>
            {/* <button onClick={hideFn}>隐藏Age列</button> */}

            <MyTable
                {...args}
                // lockChildrenFn={true}
                // lockHead={true}
            />
        </>
    );
};

export const Primary = Template.bind({
    columns: [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '50%',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            hide: false,
        },
        {
            title: 'qwe',
            dataIndex: 'qwe',
        },
    ],
});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
    columns: [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '50%',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            hide: false,
        },
        {
            title: 'qwe',
            dataIndex: 'qwe',
        },
    ],
    list: [
        {
            name: 'John Brown',
            age: 32,
            qwe: 'New York No. 1 Lake Park',
        },
        {
            name: 'John Brown',
            age: 32,
            qwe: 'New York No. 1 Lake Park',
        },
    ],
};
Primary.storyName = '1.基础';

export const Home = () => {

    const state = useStateDeep({
        hide: false,
        list: (() => {
            const arr = [];
            for (let index = 0; index < 36; index++) {
                arr.push({name: 'John Brown', age: index, qwe: 'New York No. 1 Lake Park'});
            }

            return arr;
        })(),
    });

    const hideFn = () => {
        state.hide = !state.hide;
    };

    return (
        <div className="">
            <button onClick={hideFn}>隐藏Age列</button>

            <MyTable
                columns={[
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        render (text, item) {
                            return (
                                <input
                                    value={text}
                                    onChange={(e) => {
                                        item.name = e.target.value;
                                    }}
                                />
                            );
                        },
                    },
                    {title: 'Age', dataIndex: 'age', hide: state.hide},
                    {
                        title: '操作',
                        dataIndex: 'action',
                        render (text, item) {
                            return (
                                <>
                                    <button
                                        onClick={() => {
                                            const index = state.list.findIndex(ii => ii === item);
                                            state.list.splice(index, 1);
                                        }}
                                    >
                                        删除
                                    </button>
                                </>
                            );
                        },
                    },
                ]}
                list={state.list}
            />
        </div>
    );
};
Home.storyName = '2.隐藏列';

export const Sort = () => {
    const state = useStateDeep<any>({
        orderBy: undefined,
    });

    const hideFn = () => {
        state.orderBy = state.orderBy ? undefined : {field: 'age', order: 1};
        // console.log(state.orderBy);
    };

    return (
        <div className="">
            <button onClick={hideFn}>改变排序</button>

            <MyTable
                columns={[
                    {title: 'Name', dataIndex: 'name'},
                    {
                        title: 'Age',
                        dataIndex: 'age',
                        sorter: (a: any, b: any) => a.age - b.age,
                    },
                ]}
                list={[
                    {name: 'John Brown', age: 14, qwe: 'New York No. 1 Lake Park'},
                    {name: 'John Brown', age: 31, qwe: 'New York No. 1 Lake Park'},
                    {name: 'John Brown', age: 12, qwe: 'New York No. 1 Lake Park'},
                ]}
                orderBy={state.orderBy}
                orderByChange={(e) => {state.orderBy = e;}}
            />
        </div>
    );
};
Sort.storyName = '3.受控排序';

export const RowSelect = () => {

    const myTable = createRef<TableRef>();


    const clear = () => {
        // console.log(myTable);
        myTable.current!.clearSelectItems();
    };

    const assign = () => {
        myTable.current!.assignSelectItems([1, 2]);
    };


    return (
        <div className="">
            <button onClick={clear}>清空选择</button>
            <button onClick={assign}>指定选择</button>

            <MyTable
                columns={[
                    {title: 'Name', dataIndex: 'name'},
                    {title: 'Age', dataIndex: 'age'},
                ]}
                disableRowFn={(item) => {
                    return item.key === 1;
                }}
                list={[
                    {name: 'John Brown', age: 32, qwe: 'New York No. 1 Lake Park', key: 1},
                    {name: 'John Brown', age: 32, qwe: 'New York No. 1 Lake Park', key: 2},
                    {name: 'John Brown', age: 32, qwe: 'New York No. 1 Lake Park', key: 3},
                ]}
                ref={myTable}
                rowKey="key"
                rowSelectChange={(keys, rows) => {
                    console.log(keys, rows);
                }}
            />
        </div>
    );
};
RowSelect.storyName = '4.行选择/禁止选择';

export const AjaxTable = () => {

    const dataList = (() => {
        const arr = [];
        for (let index = 0; index < 40; index++) {
            arr.push({
                name: `John Brown ${index}`,
                age: index,
                children: [{name: `John Brown ${index}`, age: index + 100}],
                list: [{aa: 6}, {aa: 5}, {aa: 4}, {aa: 3}, {aa: 2}, {aa: 1}],
            });
        }

        return arr;
    })();
    const myTable = createRef<TableRef>();

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
            }, 1000);
        });
    };


    return (
        <div className="">
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
                    {
                        title: '操作',
                        dataIndex: 'operation',
                        render (text, item, index, forceUpdate) {

                            return (
                                <>
                                    {
                                        (item.qq ? item.list : item.list?.slice?.(0, 1))?.map?.((item: TObj) => {
                                            return (
                                                <div key={item.key}>{item.aa}</div>
                                            );
                                        })
                                    }
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
                defaultSort={{field: 'asd', order: 0}}
                // expandedRowKeys={[0]}
                expandIconColumnIndex={0}
                getFormData={getFormData}
                ref={myTable}
                // lockHead={true}
                requestApi={requestApi}
                rowKey={item => item.age}
                rowSelectChange={(keys, rows) => {
                    console.log(keys, rows);
                }}
                scroll={{y: 500}}
                showTopDiv={false}
            />
        </div>
    );
};
AjaxTable.storyName = '5.列表请求';

export const AjaxTable2 = () => {

    const dataList = (() => {
        const arr = [];
        for (let index = 0; index < 60; index++) {
            arr.push({
                name: `John Brown ${index}`,
                age: index,
                children: [{name: `John Brown ${index}`, age: index + 100}],
                list: [{aa: 6}, {aa: 5}, {aa: 4}, {aa: 3}, {aa: 2}, {aa: 1}],
            });
        }

        return arr;
    })();
    const myTable = createRef<TableRef>();

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
            // console.log('请求');

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
                            total: 0,
                        },
                    },
                });
            }, 1000);
        });
    };


    return (
        <div className="">
            <button
                onClick={() => {
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
                    {
                        title: '操作',
                        dataIndex: 'operation',
                        render (text, item, index, forceUpdate) {

                            return (
                                <>
                                    {
                                        (item.qq ? item.list : item.list?.slice?.(0, 1))?.map?.((item: TObj) => {
                                            return (
                                                <div key={item.key}>{item.aa}</div>
                                            );
                                        })
                                    }
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
                defaultSort={{field: 'asd', order: 0}}
                // expandedRowKeys={[0]}
                expandIconColumnIndex={0}
                getFormData={getFormData}
                ref={myTable}
                // lockHead={true}
                requestApi={requestApi}
                rowKey={item => item.age}
                scroll={{y: 500}}
                showTopDiv={false}
                simplePaging={true}
            />
        </div>
    );
};
AjaxTable2.storyName = '6.列表请求-简单分页';

// export const LockHeadAndTopDiv = () => {
//     const dataList = (() => {
//         const arr = [];
//         for (let index = 0; index < 36; index++) {
//             arr.push({name: `John Brown ${index}`, age: index});
//         }

//         return arr;
//     })();

//     return (
//         <div className="">

//             <MyTable
//                 childrenFn={() => {
//                     return (
//                         <div style={{marginBottom: 100}}>
//                             <button>123</button>
//                             <button>123</button>
//                         </div>
//                     );
//                 }}
//                 columns={[
//                     {title: 'Name', dataIndex: 'name'},
//                     {title: 'Age', dataIndex: 'age'},
//                 ]}
//                 list={dataList}
//                 lockChildrenFn={true}
//                 lockHead={true}
//                 showTopDiv={true}
//             />
//         </div>
//     );
// };
// LockHeadAndTopDiv.storyName = '6.锁表头/置顶按钮/锁定插入内容';

export const LockHeadAndTopDiv = Template.bind({});
LockHeadAndTopDiv.storyName = '7.锁表头/置顶按钮/锁定插入内容';
LockHeadAndTopDiv.args = {
    list: (() => {
        const arr = [];
        for (let index = 0; index < 36; index++) {
            arr.push({name: `John Brown ${index}`, age: index});
        }

        return arr;
    })(),
    lockChildrenFn: true,
    lockHead: true,
    showTopDiv: true,
    columns: [
        {title: 'Name', dataIndex: 'name'},
        {title: 'Age', dataIndex: 'age'},
    ],
    childrenFn: () => {
        return (
            <div style={{marginBottom: 100}}>
                <button>123</button>
                <button>123</button>
            </div>
        );
    },
};

export const IColumnFn = createTypeFn<IColumn<object>>();
export const TableRefFn = createTypeFn<TableRef>();

export default {
    title: '组件/MyTable(表格',
    component: MyTable,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {},
    subcomponents: {
        IColumn: IColumnFn,
        ref: TableRefFn,
    },
} as ComponentMeta<typeof MyTable>;
