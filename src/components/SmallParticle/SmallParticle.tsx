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
        let getValue = () => {
            return state.value;
        };
        let setValue = (newValue: any) => {
            state.value = newValue;
        };

        // 收集
        depAdd(item, update);

        // 数据拦截
        Object.defineProperty(item, vmodel, {
            get () {
                return getValue();
            },
            set (val) {
                if (getValue() === val) return;
                setValue(val);
                // console.log(dep);
                // 触发
                depTrigget(item);
            },
        });


        return () => {
            // 移除
            depRemove(item, update);

            // 销毁后，利用闭包处理
            let value = state.value;
            getValue = () => {
                return value;
            };
            setValue = (newValue: any) => {
                value = newValue;
            };
        };
    }, [item]);


    return children(state.value, change);
};

export default SmallParticle;

