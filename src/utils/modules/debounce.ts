
type TFn = (...arg: any) => void;

export const debounce = <T extends TFn>(fn: T, interval = 0) => {

    let time = 0;

    const newFn = (...arg: any[]) => {

        clearTimeout(time);
        time = setTimeout(() => {
            fn(...arg);
        }, interval) as unknown as number;

    };

    return newFn as T;
};
