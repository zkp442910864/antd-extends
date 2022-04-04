import React, {FC, forwardRef, useImperativeHandle, useEffect, useCallback, useRef} from 'react';
import {Table, BackTop, Affix} from 'antd';
import {ColumnProps, PaginationConfig, TableRowSelection, SorterResult, TableSize, SortOrder} from 'antd/lib/table/index';
import {BackTopProps} from 'antd/lib/back-top/index';
import {AffixProps} from 'antd/lib/affix';

import globalConfig from '../config';
import Exhibit from '../Exhibit';
import {useStateDeep, useDebounceEffect, empty} from '../../utils';
import {lockTableHeadFn} from './modules/lockTableHeadFn';
import {TObj, TResData, TOrderBy, IProps, IColumn, TText, EOrderMap, TableRef} from './MyTable.type';
import './MyTable.less';

export * from './MyTable.type';

// const NewBackTop: FC<{id?: string} & BackTopProps> = (props) => <div id={props.id}><BackTop {...props} /></div>;
const NewAffix: FC<{id?: string, lockChildrenFn?: boolean} & AffixProps> = (props) => {

    const {
        lockChildrenFn,
        children,
        offsetTop,
        ...otherProps
    } = props;

    return (
        <>
            {
                lockChildrenFn
                    ? <Affix {...otherProps} offsetTop={offsetTop}>{children}</Affix>
                    : <div {...otherProps as any}>{children}</div>
            }
        </>
    );
};

const MyTable: FC<IProps> = forwardRef((
    {
        size = globalConfig.tableSize,
        sortDirections = globalConfig.tableSortDirections,
        selectWidth = globalConfig.tableSelectWidth,
        lockHeadFixedTop = globalConfig.tableLockHeadFixedTop,
        lockHeadJudgeFixedTop = globalConfig.tableLockHeadJudgeFixedTop,
        autoRowKey = true,
        autoSelectChild = false,
        childrenColumnName = 'children',

        disabledPage,
        handleColumnItemConfig,
        handlePageConfig,
        columns = [],
        disableRowFn,
        defaultSort,
        orderByChange,
        orderBy,
        showTopDiv,
        lockHead,

        requestApi,
        getFormData,
        loadChange,
        handleResData,

        rowSelectChange,
        childrenFn,
        lockChildrenFn,

        list,
        rowKey,
        style,
        className,
        loading,
        // tableData,
        ...otherProps
    }: IProps,
    ref,
) => {

    const isStaticData = Array.isArray(list);
    const isSelRow = !!rowSelectChange;

    const rawTableRef = useRef<Table<TObj> | null>(null);
    const state = useStateDeep({
        domId: `table-${Date.now()}-${parseInt(`${Math.random() * 10000000}`, 10)}`,
        domChildId: `table-child-${Date.now()}-${parseInt(`${Math.random() * 10000000}`, 10)}`,
        domTopId: `table-top-${Date.now()}-${parseInt(`${Math.random() * 10000000}`, 10)}`,
        loading: false,
        /**
         * 滚动多少后，出现置顶
         */
        showTopButton: 0,
        /**
         * 每页条数
         */
        pageSize: 20,
        /**
         * 页码
         */
        current: 1,
        /**
         * 请求 list 总条数
         */
        listTotal: 0,
        /**
         * 请求 list
         */
        ajaxList: [] as TObj[],
        /**
         * 外部传入 list
         */
        staticList: [] as TObj[],
        cache: {} as TObj,
        /**
         * 排序值
         */
        orderBy: undefined as TOrderBy | undefined,
        /**
         * 选中的 key
         */
        selectRowKeys: [] as TText[],
        /**
         * 选中的 行
         */
        selectRowItems: [] as TObj[],
        /**
         * 接口数据的存储
         */
        resData: {
            list: [],
            pagination: {
                pageSizeOptions: [20],
                pageSize: 20,
                current: 1,
                total: 0,
            },
        } as TResData,
        /**
         * 要处理顶部固定高度吗
         */
        hasHeadJudgeFixedTop: false,
    });

    // 清除函数
    const clear = useStateDeep({
        select: () => {
            state.selectRowKeys = [];
            state.selectRowItems = [];
            state.cache = {};
        },
        list: () => {
            state.current = 1;
            state.listTotal = 0;
            state.ajaxList = [];
            state.resData = {
                list: [],
                pagination: {
                    pageSizeOptions: [20],
                    pageSize: 20,
                    current: 1,
                    total: 0,
                },
            };
        },
    });

    // 各种 set 函数
    const setFn = useStateDeep({
        // 滚动条 置顶
        setScrollTop: () => {
            const domTop = document.getElementById(state.domTopId)?.querySelector('.ant-back-top') as HTMLElement;
            if (showTopDiv && domTop) {
                domTop.dispatchEvent(new Event('click'));
                domTop.click();
            }

            const dom = document.getElementById(state.domId);
            if (dom) {
                dom.querySelector('.ant-table-body')?.scroll?.(0, 0);
            }
        },
        // 设置loading
        setLoad: (val: boolean) => {
            state.loading = val;
            loadChange?.(val);
        },
        // 手动设置数据索引
        setListRowKey: (data: TObj[], level = 0) => {
            if (!data || !Array.isArray(data) || !autoRowKey) return;

            const {pageSize, current} = state;

            data.forEach((item, index) => {
                if (item.$extendTimeIndex) return;

                const childKey = childrenColumnName;
                const child = item[childKey];
                if (child && child.length) {
                    setFn.setListRowKey(child, level + 1);
                }

                item.$extendTimeIndex = `${Date.now()}-${parseInt((Math.random() * 100000000) + '', 10)}-${level}-${pageSize}-${current}-${index}`;
                // 这个值将不接受遍历和修改,保证生成的唯一性,且不影响原数据遍历
                // Object.defineProperty(item, '$extendTimeIndex', {
                //     value: `${Date.now()}-${parseInt((Math.random() * 100000000) + '', 10)}-${level}-${pageSize}-${current}-${index}`,
                //     enumerable: false,
                //     writable: false,
                // });
            });
        },
        // 设置数据 键值映射
        setListCache: (data: TObj[]) => {
            if (!data || !Array.isArray(data)) return;
            const childKey = childrenColumnName;
            const getRowKey = tableHandleFn.handleRowKey();
            const handle = (list: TObj[], cache: TObj) => {
                list.forEach((item) => {
                    const key = getRowKey(item);
                    const child = item[childKey];
                    cache[key] = item;

                    if (child && child.length) {
                        handle(child, cache);
                    }
                });
            };

            const cache: TObj = {};
            handle(data, cache);
            state.cache = cache;
        },
        // 组合参数, 并返回
        jointParamsData: (page?: number, pageSize?: number, sort?: TOrderBy, outData?: TObj) => {
            if (!getFormData) {
                // console.error('缺少 getFormData');
                // return;
                throw new Error('缺少 getFormData');
            }
            const formData = getFormData?.() || {};
            const params = {
                current: page || state.current,
                pageSize: pageSize || state.pageSize,
                orderBy: sort || state.orderBy,
                input: outData || formData,
            };
            const emptyOrderBy = !params.orderBy || !empty(params.orderBy.field) || !empty(params.orderBy.order);

            // 只有在没有排序值的时候，才会存在默认排序
            if (emptyOrderBy) {
                params.orderBy = defaultSort;
            }

            return {params, emptyOrderBy};
        },
    });

    // 请求接口
    const getList = useCallback(async (page?: number, pageSize?: number, sort?: TOrderBy, outData?: TObj) => {

        if (!requestApi || !getFormData) {
            console.error('缺少 requestApi 或 getFormData');
            return;
        }

        const {params, emptyOrderBy} = setFn.jointParamsData(page, pageSize, sort, outData);
        const errData = {
            list: [],
            pagination: {
                pageSizeOptions: [20],
                pageSize: state.pageSize,
                current: state.current,
                total: 0,
            },
        };

        clear.select();
        state.current = params.current;
        state.pageSize = params.pageSize;
        // 非空，才同步到页面显示
        if (!emptyOrderBy) {
            state.orderBy = params.orderBy;
            orderByChange?.(state.orderBy);
        }

        // 开始请求
        setFn.setLoad(true);
        setFn.setScrollTop();
        const res: TObj = await requestApi(params).then((initRes) => {
            // 数据预处理
            setFn.setListRowKey(initRes.data.list);
            setFn.setListCache(initRes.data.list);
            handleResData?.(initRes);
            return initRes;
        }).catch((error) => {
            console.log('myTable1', error);
            return errData;
        });

        const resData: TResData = res && res.data || errData;

        if (!emptyOrderBy) {
            resData.orderBy = params.orderBy;
        }

        state.listTotal = resData.pagination.total;
        state.ajaxList = resData.list;
        state.resData = resData;

        setFn.setLoad(false);
        return resData;
    }, []);

    // table的处理函数
    const tableHandleFn = useStateDeep({
        handleRowKey: () => {

            if (typeof rowKey === 'string') {
                return (item: TObj) => item[rowKey];
            }

            if (typeof rowKey === 'function') {
                return rowKey;
            }

            if (autoRowKey) {
                return (item: TObj) => item.$extendTimeIndex;
            }

            console.error('缺少 rowKey');
            return () => undefined;
        },
        // 只处理第一层列
        handleColumn: (colData: IColumn<TObj>[], orderBy: TOrderBy, resData: TResData) => {
            if (!Array.isArray(colData)) return [];

            const newColumns: IColumn<TObj>[] = [];

            colData.forEach((item) => {

                // 隐藏的过滤掉
                if (item.hide) return;

                const newItem = {
                    ...item,
                };

                if (item.sorter) {
                    newItem.sorter = item.sorter;
                    newItem.sortOrder = (orderBy && orderBy.field === item.dataIndex && EOrderMap[orderBy.order!]) as 'ascend' | 'descend' | boolean | undefined;
                }

                if (item.render) {
                    const oldRender = item.render;
                    item.render = (text, item, index) => {
                        const forceUpdate = () => {
                            // console.log(rawTableRef.current);
                            if (rawTableRef.current?.forceUpdate) {
                                rawTableRef.current?.forceUpdate();
                            } else if (isStaticData) {
                                state.staticList = [...(state.staticList as any)._raw];
                            } else {
                                state.ajaxList = [...(state.ajaxList as any)._raw];
                            }
                        };
                        return oldRender(text, item, index, forceUpdate);
                    };
                }

                handleColumnItemConfig?.(newItem, resData);

                newColumns.push(newItem);
            });

            return newColumns as ColumnProps<TObj>[];
        },
        // 处理分页配置
        handlePagination: (current: number, pageSize: number, total: number) => {
            if (disabledPage) return false;
            const pageSizeOptions = ['10', '20', '50', '100', '200', '500'];

            const obj: PaginationConfig = {
                showTotal: globalConfig.tableShowTotal || ((total) => total),
                showSizeChanger: true,
                showQuickJumper: true,
                // onShowSizeChange: this.change,
                // onChange: this.change,
                total: total,
                defaultCurrent: 1,
                // itemRender: () => {
                //     return (
                //         <>1</>
                //     );
                // },
                pageSizeOptions,
                pageSize,
                current,
            };

            // if (isStaticData && !listShowSizeChanger) {
            //     obj.showQuickJumper = false;
            //     obj.showSizeChanger = false;
            //     obj.pageSize = 10;
            // }
            handlePageConfig?.(obj);

            return obj;
        },
        // 处理行选择配置
        handleRowSelection: (sRowKeys: any[], sWidth: string, showSelectRow: boolean) => {
            if (!showSelectRow) return undefined;

            const obj: TableRowSelection<TObj> = {
                onChange: (keys) => {
                    // TODO: onChange 返回的对象好像是拷贝过的
                    // console.log(1);

                    // 首先获取到原对象
                    const items: TObj[] = (keys as TText[]).reduce((arr: TObj[], key: TText) => {
                        const data = state.cache[key];
                        arr.push(data);
                        return arr;
                    }, []);

                    // 自动选中 子体 逻辑
                    // if (autoSelectChild) {
                    //     // console.log(state.ajaxList);
                    //     // debugger;
                    //     const childKey = childrenColumnName;
                    //     const getRowKey = tableHandleFn.handleRowKey();
                    //     const handle = (list: TObj[], keyArr: TText[], itemArr: TObj[]) => {
                    //         list.forEach((item) => {
                    //             const key = getRowKey(item);
                    //             const child = item[childKey];
                    //             keyArr.push(key);
                    //             itemArr.push(item);
                    //             if (child && child.length) {
                    //                 handle(child, keyArr, itemArr);
                    //             }
                    //         });
                    //     };
                    //     const newKeys: TText[] = [];
                    //     const newItems: TObj[] = [];
                    //     handle(items, newKeys, newItems);
                    //     keys = newKeys as string[] | number[];
                    //     items = newItems;
                    // }
                    state.selectRowKeys = keys;
                    state.selectRowItems = items;
                    // rowSelectChange?.(keys, items);
                },
                onSelect: (item, selected) => {
                    // console.log(2);
                    // console.log(selected);

                    const childKey = childrenColumnName;
                    const children: TObj[] = item[childKey];
                    if (!selected || !autoSelectChild || !(children && children.length)) return;

                    const getRowKey = tableHandleFn.handleRowKey();
                    const handle = (list: TObj[], keyArr: TText[], itemArr: TObj[]) => {
                        list.forEach((item) => {
                            const key = getRowKey(item);
                            const child = item[childKey];

                            if (!~keyArr.indexOf(key) && !~itemArr.indexOf(item)) {
                                keyArr.push(key);
                                itemArr.push(item);
                            }
                            if (child && child.length) {
                                handle(child, keyArr, itemArr);
                            }
                        });
                    };

                    const newKeys = state.selectRowKeys;
                    const newItems = state.selectRowItems;
                    handle(children, newKeys, newItems);

                    // rowSelectChange?.(state.selectRowKeys, state.selectRowItems);
                },
                selectedRowKeys: sRowKeys,
                columnWidth: sWidth,
                getCheckboxProps: (item) => {
                    // console.log(item);
                    // disableRowKey
                    if (!disableRowFn) return {};

                    return {
                        disabled: disableRowFn?.(item),
                    };
                },
            };

            return obj;
        },
        // 静态列表分页(不触发接口，数据外面传入)
        staticChange: (pagination: PaginationConfig, filters: any, sorter: SorterResult<TObj>, extra: any) => {
            const {current, pageSize} = pagination;
            const {field, order} = sorter;

            state.orderBy = field && order ? {field, order: EOrderMap[order] as 0 | 1} : undefined;
            state.current = current as number;
            state.pageSize = pageSize as number;
            clear.select();
            orderByChange?.(state.orderBy);
            setFn.setScrollTop();
        },
        // 动态列表分页(触发接口)
        change: (pagination: PaginationConfig, filters: any, sorter: SorterResult<TObj>, extra: any) => {
            const {current, pageSize} = pagination;
            const {field, order} = sorter;

            const orderBy = field && order ? {field, order: EOrderMap[order] as 0 | 1} : undefined;
            getList(current, pageSize, orderBy);
        },
    });

    // 设置 showTopDiv lockHead
    useEffect(() => {
        // showTopDiv
        const dom = document.getElementById(state.domId);

        if (showTopDiv) {
            if (!dom) return;
            const top = dom.getBoundingClientRect().top;
            state.showTopButton = Math.max(top, 200);
        }

        // lockHead
        let lockObj: any;
        if (lockHead && !empty(lockHeadFixedTop) && lockHeadJudgeFixedTop && dom) {
            state.hasHeadJudgeFixedTop = lockHeadJudgeFixedTop(dom);
            lockObj = lockTableHeadFn(state.domId, lockHeadFixedTop, lockHeadJudgeFixedTop, state.domChildId, lockChildrenFn);
            if (!lockObj) return;
            window.addEventListener('scroll', lockObj.lock);
            window.addEventListener('resize', lockObj.closeLock);
        }

        return () => {
            if (!lockObj) return;
            window.removeEventListener('scroll', lockObj.scroll);
            window.removeEventListener('resize', lockObj.resize);
        };
    }, []);

    // 同步外面传入 orderBy
    useDebounceEffect(() => {
        // TODO: 可能判断不到
        if (state.orderBy !== orderBy) {
            state.orderBy = orderBy;
        }
    }, [orderBy]);

    // 防抖触发 rowSelectChange
    useDebounceEffect(() => {
        rowSelectChange?.(state.selectRowKeys, state.selectRowItems);
    }, [state.selectRowKeys, state.selectRowItems], 0, false);

    // 同步外面列表
    useDebounceEffect(() => {
        if (Array.isArray(list)) {
            setFn.setListRowKey(list);
            setFn.setListCache(list);
            state.staticList = list;
        } else {
            state.staticList = [];
        }
    }, [list]);

    // 提供外部调用方法
    useImperativeHandle(ref, () => {
        const obj: TableRef = {
            getList,
            getAjaxData: () => {
                return setFn.jointParamsData();
            },
            assignSelectItems: (arr) => {
                if (empty(rowKey)) return;
                const listData = isStaticData ? state.staticList : state.ajaxList;
                state.selectRowKeys = arr;
                state.selectRowItems = listData.filter((item) => {
                    const key = typeof rowKey === 'function' ? rowKey(item) : item[rowKey as string];

                    return arr.includes(key);
                });
            },
            clearSelectItems: () => {
                clear.select();
            },
            clearList: () => {
                clear.select();
                clear.list();
                state.loading = false;
            },
            rawTableRef: rawTableRef.current,
        };

        return obj;
    });

    return (
        <div className={`zzzz-table ${className || ''}`} id={state.domId} style={style}>
            {/* 内嵌dom */}
            <NewAffix
                className="zzzz-table-top-child"
                id={state.domChildId}
                lockChildrenFn={lockChildrenFn}
                offsetTop={state.hasHeadJudgeFixedTop ? lockHeadFixedTop : 0}
            >
                <>
                    {childrenFn && childrenFn({loading: state.loading, selectRowItems: state.selectRowItems})}
                    {/* 1231 */}
                    {/* <div>123132</div> */}
                </>
            </NewAffix>

            <Table
                bordered={true}
                {...otherProps}
                childrenColumnName={childrenColumnName}
                columns={tableHandleFn.handleColumn(columns, state.orderBy as TOrderBy, state.resData)}
                dataSource={isStaticData ? state.staticList : state.ajaxList}
                loading={state.loading || loading}
                pagination={tableHandleFn.handlePagination(state.current, state.pageSize, state.listTotal)}
                ref={rawTableRef}
                rowKey={tableHandleFn.handleRowKey()}
                rowSelection={tableHandleFn.handleRowSelection(state.selectRowKeys, selectWidth, isSelRow)}
                // scroll={scroll}
                size={size}
                sortDirections={sortDirections}
                tableLayout="fixed"
                onChange={isStaticData ? tableHandleFn.staticChange : tableHandleFn.change}
                // onRow={onRow}
            />

            {/* 置顶 */}
            <Exhibit rIf={!!showTopDiv && !!state.showTopButton}>
                <div id={state.domTopId}>
                    <BackTop visibilityHeight={state.showTopButton} />
                </div>
            </Exhibit>
        </div>
    );
});

export default MyTable;
