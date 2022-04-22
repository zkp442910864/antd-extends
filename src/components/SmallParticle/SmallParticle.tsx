import React, {FC, useEffect} from 'react';

import {useStateDeep, useDebounceEffect, empty, sleep, useStateDeepValue} from '../../utils';
import {IProps, TObj, IDep} from './SmallParticle.type';

export * from './SmallParticle.type';

/**
 * TODO:
 *  考虑是否去掉内置 state
 *  直接外层中对值进行操作，主要触发组件更新就可以了
 */

// 针对同一对象，做收集，处理数据联动关系
const dep: IDep[] = [];
const depAdd = (item: TObj, fn: () => void) => {
    let depItem = dep.find(ii => ii.item === item);
    if (!depItem) {
        depItem = {
            item,
            fnArr: [],
        };
        dep.push(depItem);
    }

    depItem.fnArr.push(fn);
};
const depRemove = (item: TObj, fn: () => void) => {
    const depIndex = dep.findIndex(ii => ii.item === item);
    const depItem = dep[depIndex];

    // 删除函数
    if (depItem) {
        const index = depItem.fnArr.findIndex(ii => ii === fn);
        index > -1 && depItem.fnArr.splice(index, 1);
    }

    // 删除对象
    if (depItem && !depItem.fnArr.length) {
        dep.splice(depIndex, 1);
    }
};
const depTrigget = (item: TObj) => {
    const depItem = dep.find(ii => ii.item === item);
    if (depItem?.fnArr?.length) {
        depItem.fnArr.forEach((fn) => {
            fn();
        });
    }
};

// 收集函数
const mapGetValue = new WeakMap<TObj, {[key: string]: () => any}>();
const mapSetValue = new WeakMap<TObj, {[key: string]: (val: any) => void}>();

// 代理
const proxyItem = (item: TObj, key: string, getValue: () => any, setValue: (val: any) => void) => {


    mapGetValue.set(item, Object.assign(mapGetValue.get(item) || {}, {[key]: getValue}));
    mapSetValue.set(item, Object.assign(mapSetValue.get(item) || {}, {[key]: setValue}));

    const result = Reflect.defineProperty(item, key, {
        get () {
            return mapGetValue.get(item)?.[key]?.();
        },
        set (newVal) {
            // debugger;
            mapSetValue.get(item)?.[key]?.(newVal);
        },
    });

    return result;
};

// 组件
const SmallParticle: FC<IProps> = (props) => {

    const {
        children,
        item = {},
        vmodel = '',
    } = props;

    const state = useStateDeepValue<any>(item[vmodel]);
    const random = useStateDeepValue<number>(0);

    const change = (newVal?: any) => {
        state.value = newVal;
        // 触发
        depTrigget(item);
    };

    // 直接使用 Object.defineProperty 对数据进行拦截
    useEffect(() => {

        const update = () => {
            random.value = Math.random() * 100000000;
        };

        // 未销毁的时候，使用 useStateDeepValue
        const getValue = () => {
            return state.value;
        };
        const setValue = (val: any) => {
            // console.log(getValue());
            if (getValue() === val) return;
            state.value = val;
            // 触发
            depTrigget(item);
        };

        // 收集
        depAdd(item, update);

        // 数据拦截
        proxyItem(item, vmodel, getValue, setValue);

        return () => {
            // 移除
            depRemove(item, update);

            // 销毁后，利用闭包处理
            let value = state.value;
            const getValue = () => {
                return value;
            };
            const setValue = (newValue: any) => {
                value = newValue;
            };
            proxyItem(item, vmodel, getValue, setValue);
        };
    }, [item]);


    return children(state.value, change);
};

export default SmallParticle;

