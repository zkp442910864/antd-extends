
import {useEffect, useRef, useState, useCallback, useMemo} from 'react';

import {useStateAutoStop} from './useStateAutoStop';
import {deepValue, TCb, TCb2, TRData} from '../modules/deepProxy';
import {deepProxy} from '../modules/deepProxyNew';
import {throttleDebounce} from '../modules/throttleDebounce';
import {debounce} from '../modules/debounce';

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

    const tdFun = useMemo(() => {
        // return throttleDebounce((...arg: any) => {
        //     setRandom(Date.now() + Math.random());
        // }, 0);
        // return debounce((...arg: any) => {
        //     // console.log('debounce', arg);
        //     setRandom(Date.now() + Math.random());
        // }, 0);
        return (...arg: any) => {
            setRandom(Date.now() + Math.random());
        };
    }, []);

    const proxy = useMemo(() => {
        return deepProxy(val as any, (...arg) => {
            cb?.(...arg);
            tdFun(...arg);
            // window.requestAnimationFrame(tdFun);
        });
    }, []);

    return proxy as T & TRData;
};

/**
 * 基本同 useStateDeep
 */
export const useStateDeepNew = <T>(val: T, cb?: TCb) => {
    const [random, setRandom] = useStateAutoStop(0);
    const deepLock = useRef(false);

    const setDeepLock = useMemo(() => {
        return (val: boolean) => {
            deepLock.current = val;
            !val && tdFun();
        };
    }, []);

    const tdFun = useMemo(() => {
        return () => {
            if (deepLock.current) return;
            setRandom(Date.now() + Math.random());
        };
    }, []);

    const proxy = useMemo(() => {
        return deepProxy(val as any, (...arg) => {
            cb?.(...arg);
            tdFun();
        });
    }, []);

    return [proxy, setDeepLock] as [T, (val: boolean) => void];
};


/**
 * 针对单一值, 类似 vue-ref
 * 监听变化, 同时触发重新渲染
 * @param {*} val array / object
 */
export const useStateDeepValue = <T>(val: T, cb?: TCb2) => {
    const [random, setRandom] = useStateAutoStop(0);

    const tdFun = useMemo(() => {
        // return throttleDebounce(() => {
        //     setRandom(Date.now() + Math.random());
        // }, 16);
        return () => {
            setRandom(Date.now() + Math.random());
        };
    }, []);

    const proxy = useMemo(() => {
        return deepValue<T>(val, (...arg) => {
            cb?.(...arg);
            tdFun();
            // window.requestAnimationFrame(tdFun);
        });
    }, []);

    return proxy;
};


type TObj = {[key: string]: any};
