import {useEffect, useRef, useState, useCallback, useMemo} from 'react';


/**
 * use 函数防抖
 * @param {*} fn 执行函数
 * @param {*} interval 间隔
 * @returns 新函数
 */

type TFn = (...arg: any[]) => void;

export const useDebounceFn = <F extends TFn = TFn>(fn: F, interval = 100) => {
    const lock = useRef(false);
    const time = useRef(0);

    // 执行函数
    const newFn = ((...arg) => {
        clearTimeout(time.current);

        time.current = setTimeout(() => {
            if (!lock.current) return;
            fn(...arg);
        }, interval) as unknown as number;
    }) as F;

    // 开关控制
    useEffect(() => {
        lock.current = true;

        return () => {
            lock.current = false;
        };
    });

    return newFn;
};


// useDebounceFn((params) => {
//     console.log(123);
// });
