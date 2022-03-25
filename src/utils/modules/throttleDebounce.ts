

// 节流 + 防抖
// 第一次马上执行，后面的连续操作，只有最后一次触发

type TFn = (...arg: any[]) => void;
export const throttleDebounce = <F extends TFn>(fn: F, interval = 300) => {
    let flagTime = 0;
    let timer = 0;

    return ((...arg) => {

        // 节流
        if (flagTime + interval < Date.now()) {
            flagTime = Date.now();
            clearTimeout(timer);
            fn(...arg);

            return;
        }

        // 防抖
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...arg);
        }, interval) as unknown as number;
    }) as F;
};


