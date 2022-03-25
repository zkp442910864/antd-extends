import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';


/**
 * hooks Effect 防抖
 * @param {*} fn 执行函数
 * @param {*} deps 监听数组
 * @param {*} interval 间隔时间
 * @param {*} immediateRun 初始化后立马执行
 */

export const useDebounceEffect = (fn: React.EffectCallback, deps: React.DependencyList, interval = 100, immediateRun = true) => {
    const time = useRef(0);
    const [lock, setLock] = useState(true);
    const immediate = useRef(immediateRun);
    const destroy = useRef<any | (() => void)>();

    useEffect(() => {

        if (!lock) {
            destroy.current = fn();
            setLock(true);
        }

    }, [lock]);

    // 开关控制
    useEffect(() => {
        if (!immediate.current) {
            immediate.current = true;
            return;
        }

        time.current = setTimeout(() => {
            setLock(false);
        }, interval) as unknown as number;

        return () => {
            destroy.current && destroy.current();
            clearTimeout(time.current);
        };
    }, deps);
};