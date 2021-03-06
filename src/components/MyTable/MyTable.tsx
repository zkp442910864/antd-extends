import React, {FC, forwardRef, useImperativeHandle, useEffect, useCallback, useRef} from 'react';
import {Table, BackTop, Affix} from 'antd';
import {ColumnProps, PaginationConfig, TableRowSelection, SorterResult, TableSize, SortOrder} from 'antd/lib/table/index';
import {BackTopProps} from 'antd/lib/back-top/index';
import {AffixProps} from 'antd/lib/affix';

import globalConfig from '../config';
import Exhibit from '../Exhibit';
import {useStateDeep, useDebounceEffect, empty, sleep, useStateDeepValue, emptyArray, jsCopy, toRaw} from '../../utils';
import {lockTableHeadFn} from './modules/lockTableHeadFn';
import {setCascadeChoice} from './modules/cascadeChoice';
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
        simplePaging = false,

        disabledPage,
        handleColumnItemConfig,
        handlePageConfig,
        // handleRowSelectionConfig,
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
    // ???????????? list, ????????????????????????
    const staticList = useStateDeepValue<TObj[]>([]);
    // ???????????????, ??????????????????
    const cache = useStateDeepValue<TObj>({});
    // ????????????, ??????????????????
    const parentCache = useStateDeepValue<TObj>({});
    const state = useStateDeep({
        domId: `table-${Date.now()}-${parseInt(`${Math.random() * 10000000}`, 10)}`,
        domChildId: `table-child-${Date.now()}-${parseInt(`${Math.random() * 10000000}`, 10)}`,
        domTopId: `table-top-${Date.now()}-${parseInt(`${Math.random() * 10000000}`, 10)}`,
        loading: false,
        /**
         * ??????????????????????????????
         */
        showTopButton: 0,
        /**
         * ????????????
         */
        pageSize: 20,
        /**
         * ??????
         */
        current: 1,
        /**
         * ?????? list ?????????
         */
        listTotal: 0,
        /**
         * ?????? list
         */
        ajaxList: [] as TObj[],
        /**
         * ?????????
         */
        orderBy: undefined as TOrderBy | undefined,
        /**
         * ????????? key
         */
        selectRowKeys: [] as TText[],
        /**
         * ????????? ???
         */
        selectRowItems: [] as TObj[],
        /**
         * ?????????????????????
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
         * ??????????????????????????????
         */
        hasHeadJudgeFixedTop: false,
    });

    // ????????????
    const clear = useStateDeep({
        select: () => {
            state.selectRowKeys = [];
            state.selectRowItems = [];
        },
        list: () => {
            cache.value = {};
            parentCache.value = {};
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

    // ?????? set ??????
    const setFn = useStateDeep({
        // ????????? ??????
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
        // ??????loading
        setLoad: (val: boolean) => {
            state.loading = val;
            loadChange?.(val);
        },
        // ????????????????????????
        setListRowKey: (data: TObj[]) => {
            if (!data || !Array.isArray(data) || !autoRowKey) return;

            const {pageSize, current} = state;

            const handle = (data: TObj[], level = 0) => {

                data.forEach((item, index) => {
                    if (!item.$extendTimeIndex) {
                        item.$extendTimeIndex = `${Date.now()}-${parseInt((Math.random() * 100000000) + '', 10)}-${level}-${pageSize}-${current}-${index}`;
                        // const val = `${Date.now()}-${parseInt((Math.random() * 100000000) + '', 10)}-${level}-${pageSize}-${current}-${index}`;
                        // // // ????????????????????????????????????,????????????????????????,???????????????????????????
                        // Object.defineProperty(item, '$extendTimeIndex', {
                        //     // value: `${Date.now()}-${parseInt((Math.random() * 100000000) + '', 10)}-${level}-${pageSize}-${current}-${index}`,
                        //     // enumerable: false,
                        //     // writable: false,
                        //     get () {
                        //         return val;
                        //     },
                        // });
                    }

                    const childKey = childrenColumnName;
                    const child = item[childKey];
                    if (child?.length) {
                        handle(child, level + 1);
                    }
                });
            };

            handle(data);
        },
        // ???????????? ????????????
        setListCache: (data: TObj[]) => {
            if (!data || !Array.isArray(data)) return;
            const childKey = childrenColumnName;
            const getRowKey = tableHandleFn.handleRowKey();
            // debugger;
            const handle = (list: TObj[], cache: TObj, parentCache: TObj, parentItem?: TObj) => {
                list.forEach((item) => {
                    const key = getRowKey(item);
                    // ????????????
                    cache[key] = item;

                    // ??????key???????????????
                    if (parentItem) {
                        parentCache[key] = parentItem;
                    }

                    const child = item[childKey];
                    if (child && child.length) {
                        handle(child, cache, parentCache, item);
                    }
                });
            };

            const newCache: TObj = {};
            const newParentCache: TObj = {};
            handle(data, newCache, newParentCache);

            cache.value = newCache;
            parentCache.value = newParentCache;
        },
        // ????????????, ?????????
        jointParamsData: (page?: number, pageSize?: number, sort?: TOrderBy, outData?: TObj) => {
            if (!getFormData) {
                // console.error('?????? getFormData');
                // return;
                throw new Error('?????? getFormData');
            }
            const formData = getFormData?.() || {};
            const params = {
                current: page || state.current,
                pageSize: pageSize || state.pageSize,
                orderBy: sort || state.orderBy,
                input: outData || formData,
            };
            const emptyOrderBy = !params.orderBy || !empty(params.orderBy.field) || !empty(params.orderBy.order);

            // ????????????????????????????????????????????????????????????
            if (emptyOrderBy) {
                params.orderBy = defaultSort;
            }

            return {params, emptyOrderBy};
        },
        // ??????????????????
        handleSimplePaging: async (data: TResData, page: number, pageSize: number) => {
            const listLength = data.list.length;
            const maxTotal = page * pageSize;

            // total ?????????????????????????????????????????????
            if (data.pagination.total > 0) return;

            if (listLength <= 0) {
                // ??? 0 ??????????????????????????????????????????????????????
                data.pagination.total = maxTotal - pageSize;
                data.list = state.resData.list;
                state.current = page - 1;
                await sleep(0);
                await getList(page - 1);
                state.listTotal = maxTotal - pageSize;
                // resData!.pagination.total = maxTotal - pageSize;
                // console.log(resData);
            } else if (listLength >= pageSize) {
                // ?????????????????????????????????????????????
                data.pagination.total = maxTotal + pageSize;
            } else if (listLength < pageSize) {
                // ??????????????????????????????????????????
                data.pagination.total = maxTotal - pageSize + listLength;
            }
        },
    });

    // ????????????
    const getList = useCallback(async (page?: number, pageSize?: number, sort?: TOrderBy, outData?: TObj) => {

        if (!requestApi || !getFormData) {
            // console.error('?????? requestApi ??? getFormData');
            // return;
            throw new Error('?????? requestApi ??? getFormData');
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
        // ?????????????????????????????????
        if (!emptyOrderBy) {
            state.orderBy = params.orderBy;
            orderByChange?.(state.orderBy);
        }

        // ????????????
        setFn.setLoad(true);
        setFn.setScrollTop();
        const res: TObj = await requestApi(params).then((initRes) => {
            // ???????????????
            setFn.setListRowKey(initRes.data.list);
            setFn.setListCache(initRes.data.list);
            simplePaging && setFn.handleSimplePaging(initRes.data, params.current, params.pageSize);
            handleResData?.(initRes);
            return initRes;
        }).catch((error) => {
            console.log('myTable1', error);
            return errData;
        });

        let resData: TResData = res && res.data || errData;

        if (!emptyOrderBy) {
            resData.orderBy = params.orderBy;
        }

        state.listTotal = resData.pagination.total;
        state.ajaxList = resData.list;
        state.resData = resData;

        setFn.setLoad(false);

        // ????????????????????????????????????????????????
        if (!resData.list.length && resData.pagination.current > 1 && resData.pagination.total) {
            resData = await getList(1);
        }

        return resData;
    }, []);

    // table???????????????
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

            console.error('?????? rowKey');
            return () => undefined;
        },
        // ?????????????????????
        handleColumn: (colData: IColumn<TObj>[], orderBy: TOrderBy, resData: TResData) => {
            if (!Array.isArray(colData)) return [];

            const newColumns: IColumn<TObj>[] = [];

            colData.forEach((item) => {

                // ??????????????????
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
                    newItem.render = (text, item, index) => {
                        const forceUpdate = () => {
                            // console.log(rawTableRef.current);
                            if (rawTableRef.current?.forceUpdate) {
                                rawTableRef.current?.forceUpdate();
                            } else if (isStaticData) {
                                staticList.value = [...staticList.value!];
                            } else {
                                state.ajaxList = [...toRaw(state.ajaxList)];
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
        // ??????????????????
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

            if (simplePaging) {
                obj.className = 'zzzz-simple-paging';
                obj.showQuickJumper = false;

                obj.showTotal = (total) => {
                    return (
                        <>
                            {/* <span>???{total}???</span> */}
                            <span>???{current}???</span>
                        </>
                    );
                };
                obj.itemRender = (current, type, originalElement) => {
                    if (type === 'prev') {
                        return <a>?????????</a>;
                    }
                    if (type === 'next') {
                        return <a>?????????</a>;
                    }
                    // console.log(originalElement);
                    return originalElement;
                };
            }


            handlePageConfig?.(obj);

            return obj;
        },
        // ?????????????????????
        handleRowSelection: (sRowKeys: any[], sWidth: string, showSelectRow: boolean) => {
            if (!showSelectRow) return undefined;

            const obj: TableRowSelection<TObj> = {
                onChange: (keys) => {
                    // TODO: onChange ????????????????????????????????????
                    // console.log(1);

                    // debugger;
                    // ????????????????????????
                    const items: TObj[] = (keys as TText[]).reduce((arr: TObj[], key: TText) => {
                        const data = cache.value![key];
                        arr.push(data);
                        return arr;
                    }, []);

                    state.selectRowKeys = keys;
                    state.selectRowItems = items;
                    // rowSelectChange?.(keys, items);
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

            if (autoSelectChild) {
                obj.onSelect = (item, selected, selectedRows) => {
                    // console.log(2);
                    // console.log(item, selected, selectedRows, parentCache.value);
                    const newArr = setCascadeChoice({
                        item,
                        selected,
                        selectRowKeys: state.selectRowKeys,
                        childrenColumnName,
                        parentCache: parentCache.value,
                        getRowKey: tableHandleFn.handleRowKey(),
                    });

                    // console.log(newArr);

                    state.selectRowKeys = newArr;
                    state.selectRowItems = newArr.map((key) => {
                        return cache.value[key];
                    });

                };
            }

            // handleRowSelectionConfig?.(cache, state, childrenColumnName, autoSelectChild, tableHandleFn, sRowKeys, sWidth, disableRowFn);

            return obj;
        },
        // ??????????????????(????????????????????????????????????)
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
        // ??????????????????(????????????)
        change: (pagination: PaginationConfig, filters: any, sorter: SorterResult<TObj>, extra: any) => {
            const {current, pageSize} = pagination;
            const {field, order} = sorter;

            const orderBy = field && order ? {field, order: EOrderMap[order] as 0 | 1} : undefined;
            getList(current, pageSize, orderBy);
        },
    });

    // ?????? showTopDiv lockHead
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

    // ?????????????????? orderBy
    useDebounceEffect(() => {
        // TODO: ??????????????????
        if (state.orderBy !== orderBy) {
            state.orderBy = orderBy;
        }
    }, [orderBy]);

    // ???????????? rowSelectChange
    useDebounceEffect(() => {
        rowSelectChange?.(state.selectRowKeys, state.selectRowItems);
    }, [state.selectRowKeys, state.selectRowItems], 0, false);

    // ??????????????????
    useDebounceEffect(() => {
        if (empty(list)) return;

        if (Array.isArray(list)) {
            setFn.setListRowKey(list);
            setFn.setListCache(list);

            staticList.value = [...list];
        } else {
            staticList.value = [];
            cache.value = {};
            parentCache.value = {};
        }
    }, [list, list?.length]);

    // ????????????????????????
    useImperativeHandle(ref, () => {
        const obj: TableRef = {
            getList,
            getAjaxData: () => {
                return setFn.jointParamsData();
            },
            assignSelectItems: (arr) => {
                if (empty(rowKey)) return;
                const listData = isStaticData ? list : state.ajaxList;
                state.selectRowKeys = arr;
                state.selectRowItems = listData!.filter((item) => {
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
            {/* ??????dom */}
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
                dataSource={isStaticData ? staticList.value : state.ajaxList}
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

            {/* ?????? */}
            <Exhibit rIf={!!showTopDiv && !!state.showTopButton}>
                <div id={state.domTopId}>
                    <BackTop visibilityHeight={state.showTopButton} />
                </div>
            </Exhibit>
        </div>
    );
});

export default MyTable;
