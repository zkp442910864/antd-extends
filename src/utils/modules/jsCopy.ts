import moment from 'moment';

type TJsCopyObj = <T>(data: T, cache?: any[]) => T;

export const jsCopy: TJsCopyObj = (data: any, cache = []) => {
    // debugger
    // if (data === null || typeof data !== 'object') {
    //     return data;
    // }

    // if (typeof data === 'object' && data._isAMomentObject) return
    data = specialType(data);

    if (!isCopyType(data)) return data;

    // 循环引用
    const find = cache.find((i) => {
        return i.old === data;
    });
    if (find) {
        return find.obj;
    }

    const obj: any = Array.isArray(data) ? [] : {};

    cache.push({
        obj,
        old: data,
    });

    Object.keys(data).forEach((key: string) => {
        obj[key] = jsCopy(data[key], cache);
    });

    return obj;
};

/**
 * 判断是否符合的拷贝对象
 */
export const isCopyType = (data: any) => {


    if (
        typeof data !== 'object' ||
        data === null ||
        // 排除其他数据类型
        ![
            '[object Object]',
            '[object Array]',
            '[object Number]',
            '[object Boolean]',
            '[object String]',
        ].includes(Object.prototype.toString.call(data))
    ) return false;

    // 针对 moment 处理
    if (data._isAMomentObject) return false;

    return true;
};

/**
 * 特殊类型复制
 */
export const specialType = <T extends object>(data: any) => {

    if (data === null || typeof data !== 'object') return data as T;

    if (Object.prototype.toString.call(data) === '[object Date]') {
        return new Date(data) as T;
    }

    if (data._isAMomentObject) {
        return moment(data) as T;
    }

    return data as T;
};
