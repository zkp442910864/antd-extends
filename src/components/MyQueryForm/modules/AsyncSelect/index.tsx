import React, {FC} from 'react';
import {Select, Spin} from 'antd';
// import moment from 'moment';
import {SelectProps, LabeledValue} from 'antd/lib/select';

import {useStateDeep, useDebounceEffect, empty, toRaw} from '../../../../utils';

import {IProps, TObj, TText, TRequestApi} from './index.type';

export * from './index.type';

const Option = Select.Option;

const useStatic = (options: TObj[], valueKey: string) => {
    const state = useStateDeep({
        list: [] as TObj[],
        cache: {} as TObj,
    });

    // 同步数据
    useDebounceEffect(() => {
        const data: TObj[] = [];
        const cache: TObj = {};
        if (options && options.length) {
            options.forEach((item) => {
                const key = item[valueKey];
                data.push(item);
                cache[key] = item;
            });
        }

        state.list = data;
        state.cache = cache;
    }, [options]);

    return {
        list: state.list,
        cache: state.cache,
        ajacList: undefined,
        loading: false,
        selectProps: {},
    };
};

const useLoad = (requestApi: TRequestApi, requestParams: TObj, valueKey: string) => {
    const state = useStateDeep({
        list: [] as TObj[],
        cache: {} as TObj,
        loading: false,
    });

    // 请求数据
    const ajacList = async () => {

        if (state.loading || state.list.length) {
            return;
        }

        state.loading = true;
        try {
            const res = await requestApi(requestParams);
            const cache: TObj = {};

            // 健值映射
            res.data.forEach((item) => {
                cache[item[valueKey]] = item;
            });

            state.cache = cache;
            state.list = res.data;
            // console.log(state);

        } catch (error) {
            console.log(error);
        }

        state.loading = false;
    };

    return {
        list: state.list,
        cache: state.cache,
        ajacList,
        loading: state.loading,
        selectProps: {
            showSearch: true,
        },
    };
};

const AsyncSelect: FC<IProps> = ({
    valueKey = 'value',
    textKey = 'title',
    dataType = 'static',
    requestParams = {},
    style = {},
    options,
    requestApi,
    onChange,
    value,
    ...otherProps
}) => {


    const {list, cache, selectProps, loading, ajacList} = (() => {
        const map = {
            static: () => useStatic(options!, valueKey),
            load: () => useLoad(requestApi!, requestParams!, valueKey),
        };
        return map[dataType]();
    })();


    const change = (indes?: TText | TText[] | LabeledValue | LabeledValue[]) => {

        if (typeof indes === 'undefined' || indes === null) {
            onChange?.();
            return;
        }

        // debugger;
        // 各种状态的处理
        if (Array.isArray(indes) && typeof indes[0] === 'object') {
            const [keyArr, valArr]: [LabeledValue[], TObj[]] = [[], []];
            keyArr.forEach((keyItem) => {
                const valItem = cache[keyItem.key];
                keyArr.push(keyItem);
                valArr.push(toRaw(valItem));
            });
            onChange?.(keyArr, valArr);
        } else if (Array.isArray(indes)) {
            const [keyArr, valArr]: [TText[], TObj[]] = [[], []];

            (indes as TText[]).forEach((key) => {
                const val = cache[key];
                keyArr.push(key);
                valArr.push(toRaw(val));
            });
            onChange?.(keyArr, valArr);
        } else if (typeof indes === 'object') {
            const val = cache[indes.key];
            onChange?.(indes, toRaw(val));
        } else {
            const key = indes;
            const val = cache[key];
            onChange?.(key, toRaw(val));
        }

    };

    const checkData = () => {
        const data = undefined;

        // if (!list.length) {
        //     data = <div>暂无数据</div>;
        // }

        return data;
    };


    return (
        <Select
            maxTagCount={2}
            maxTagPlaceholder={() => {
                return (
                    <div>
                        已选择{(Array.isArray(value) ? value : []).length}
                    </div>
                );
            }}
            optionFilterProp="title"
            {...otherProps}
            {...selectProps}
            notFoundContent={loading ? <Spin size="small" /> : checkData()}
            style={Object.assign({minWidth: 100}, style)}
            value={value}
            onChange={change}
            onFocus={ajacList}
        >
            {
                list.map((sel) => {
                    return (
                        <Option
                            key={sel[valueKey]}
                            title={sel[textKey]}
                            value={sel[valueKey]}
                        >
                            {sel[textKey]}
                        </Option>
                    );
                })
            }
        </Select>
    );
};


export default AsyncSelect;
