import {useEffect, useRef, useState, useCallback, useMemo} from 'react';


/**
 * 同 useState 使用
 *
 * 组件销毁后不再执行
 * @param {*} val
 * @returns
 */
export const useStateAutoStop = <T = any>(val?: T) => {
    const [value, setValue] = useState(val);
    const lock = useRef(false);

    // 可以考虑加个防抖，不知道会不会出现意外情况
    const setNewValue = useCallback((nVal) => {
        if (lock.current) return;
        setValue(nVal);
    }, []);

    // 开关控制
    useEffect(() => {
        lock.current = false;

        return () => {
            lock.current = true;
        };
    }, []);

    return [value, setNewValue] as [T, (newV?: T | ((lastV: T) => T)) => void];
};


// const a = () => {
//     // const [a, seta] = useState(0);
//     // // seta(1)
//     // seta(() => {
//     //     return 0;
//     // });
//     const [a, set] = useStateAutoStop({});
//     set({
//         a: 1,
//         b: 2,
//     });
//     set((last) => {
//         last = {qq: 2};
//         // return last;
//     });
// };