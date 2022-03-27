import React, {createRef, FC, useEffect} from 'react';
import {Spin, TreeSelect} from 'antd';
import {TreeSelectProps} from 'antd/lib/tree-select';

import {useStateDeep, useDebounceEffect, jsCopy} from '../../../../utils';
import {IProps, TObj, TText} from './index.type';

export * from './index.type';

const AsyncTreeSelect: FC<IProps> = ({
    dataField = {
        titleKey: 'title',
        valueKey: 'value',
        childrenKey: 'children',
    },
    showCheckedStrategy = 'SHOW_CHILD',
    style = {},
    disabledRoot,
    treeOptions,
    value,
    onChange,
    multiple,
    requestApi,
    requestParams = {},
    ...otherProps
}) => {

    let curOtherProps = {};
    const state = useStateDeep({
        loading: false,
        data: [] as TObj[],
        searchText: '',
        treeData: [] as TObj[],
        cache: {} as TObj,
    });

    // 平铺数据，并处理掉空children
    const tileData = (data?: TObj[]) => {
        if (!Array.isArray(data)) return {data: [], cache: {}};

        const {titleKey, valueKey, childrenKey} = dataField;
        const cache: TObj = {};
        // const newData = jsCopy(data);

        const handle = (list: TObj[], newData: TObj[]) => {

            list.forEach((item) => {
                const key = item[valueKey];
                const title = item[titleKey];
                const child = item[childrenKey];
                // 一个新的对象
                const newItem: TObj = {
                    raw: item,
                    children: [],
                    value: key,
                    title,
                };
                cache[key] = newItem;

                if (child && child.length) {
                    newItem.disabled = !!disabledRoot;
                    handle(child, newItem.children);
                } else {
                    newItem.children = undefined;
                }

                newData.push(newItem);
            });

        };

        const newData: TObj[] = [];
        handle(data, newData);

        return {data: newData, cache};
    };

    // 设置数据
    const setTreeData = (treeData?: TObj[]) => {
        const {data, cache} = tileData(treeData);
        state.data = data;
        state.treeData = data;
        state.cache = cache;
        // console.log(state);
    };

    // 请求
    const treeSelectFocus = async (e: any) => {

        if (e.target.tagName !== 'INPUT' && multiple) return;
        if (!requestApi) return;

        if (state.loading || state.data.length || (treeOptions || []).length) {
            return;
        }

        state.data = [];
        state.cache = {};
        state.loading = true;

        try {
            const res = await requestApi(requestParams);
            // const {data, cache} = tileData(res.data);
            // state.data = data;
            // state.treeData = data;
            // state.cache = cache;
            setTreeData(res.data);

        } catch (error) {
            console.log(error);
        }

        state.loading = false;
    };

    // 检查是否有数据
    const checkData = () => {
        const data = undefined;

        // if (!(treeOptions || []).length && !state.loading && !state.data.length) {
        //     data = <div>暂无数据</div>;
        // }

        return data;
    };

    // 回调
    const change = (val: TText | TText[], label: any, extra: any) => {
        // if (typeof val === 'undefined' || val === null) {
        //     onChange?.();
        //     return;
        // }

        // console.log(state);
        if (Array.isArray(val)) {
            const items: TObj[] = [];
            val.forEach((key) => {
                items.push(state.cache[key]._raw);
            });
            onChange?.(val, items, {val, label, extra});
        } else {
            onChange?.(val, state.cache[val]?._raw, {val, label, extra});
        }
    };

    if (multiple) {
        curOtherProps = {
            maxTagCount: 0,
            maxTagPlaceholder: () => {
                const val = value || [];
                return val.length ? `已选${val.length}条数据` : '请选择';
            },
            showSearch: true,
            treeCheckable: true,
        };
    } else {
        curOtherProps = {
            showSearch: true,
        };
    }

    // 外部数据-展示
    useEffect(() => {
        setTreeData(treeOptions);
    }, [treeOptions]);

    // 查询，防抖展示数据
    useDebounceEffect(() => {
        state.treeData = state.data;
    }, [state.searchText], 300);

    return (
        <TreeSelect
            dropdownStyle={{maxHeight: 300}}
            treeNodeFilterProp="title"
            treeNodeLabelProp="title"
            {...curOtherProps}
            {...otherProps}
            autoClearSearchValue={false}
            notFoundContent={state.loading ? <Spin size="small" /> : checkData()}
            searchValue={state.searchText}
            showCheckedStrategy={showCheckedStrategy || ['SHOW_ALL', 'SHOW_PARENT', 'SHOW_CHILD'][2] as 'SHOW_CHILD'}
            style={Object.assign({minWidth: 100}, style)}
            treeData={state.treeData}
            value={value}
            onChange={change}
            // 清除输入文字
            onDropdownVisibleChange={(open) => {
                state.searchText = '';
            }}
            onFocus={(e) => treeSelectFocus(e)}
            onSearch={(val) => {
                state.searchText = val;
                // 清空了，再赋值
                state.treeData = [];
            }}
        />
    );
};


export default AsyncTreeSelect;
