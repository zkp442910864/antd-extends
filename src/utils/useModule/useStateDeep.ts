import {useEffect, useRef, useState, useCallback, useMemo} from 'react';

import {useStateAutoStop} from './useStateAutoStop';
import {deepProxy, deepValue, TCb, TCb2, TRData} from '../modules/deepProxy';
import {throttleDebounce} from '../modules/throttleDebounce';

/**
 * 深层变化监听, 类似 vue-reactive
 * 对象深度监听, 同时触发重新渲染
 * @param {*} val array / object
 *
 * TODO: 使用这种会造成性能卡顿
 * item.tableCampaign = item.tableCampaign || {key: item.CampaignId, label: item.CampaignName};
 */
export const useStateDeep = <T>(val: T, cb?: TCb) => {
    const [random, setRandom] = useStateAutoStop(0);

    // 不需要做处理，频繁调用，react内部会处理
    const tdFun = useMemo(() => {
        // return throttleDebounce(() => {
        //     setRandom(Date.now() + Math.random());
        // }, 16);
        return () => {
            setRandom(Date.now() + Math.random());
        };
    }, []);

    const proxy = useMemo(() => {
        return deepProxy(val, (...arg) => {
            cb?.(...arg);
            tdFun();
        });
    }, []);

    return proxy as T & TRData;
};


/**
 * 针对单一值, 类似 vue-ref
 * 监听变化, 同时触发重新渲染
 * @param {*} val array / object
 */
export const useStateDeepValue = <T>(val?: T, cb?: TCb2) => {
    const [random, setRandom] = useStateAutoStop(0);

    // 不需要做处理，频繁调用，react内部会处理
    const tdFun = useMemo(() => {
        // return throttleDebounce(() => {
        //     setRandom(Date.now() + Math.random());
        // }, 16);
        return () => {
            setRandom(Date.now() + Math.random());
        };
    }, []);

    const proxy = useMemo(() => {
        return deepValue(val, (...arg) => {
            cb?.(...arg);
            tdFun();
        });
    }, []);

    return proxy;
};
