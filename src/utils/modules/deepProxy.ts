import {isCopyType} from './jsCopy';

/**
 * 深度监听
 * TODO: 注意: 会改变数据类型(object -> proxy)
 * @param {*} data 深度监听的对象
 * @param {*} cb 设置/删除时候触发
 * @param {*} parentRawObj 父级对象-不需要填
 * @param {*} parentKey 指定的key-不需要填
 * @returns proxy
 */
export const deepProxy = <T extends TRData = any>(
    data: T,
    cb?: TCb,
    cache: {proxy?: T, rawObj: TData, data: T}[] = [],
    parentRawObj?: TData,
    parentKey?: string | number | symbol,
) => {
    // debugger;
    const mountData = (rObj: TData) => {
        // TODO: 父层数据关联子层数据 （类似深拷贝）
        if (typeof parentRawObj === 'object' && typeof parentKey !== 'undefined') {
            parentRawObj[parentKey as number] = rObj;
        }
    };

    // 不合适的数据类型都排除掉
    if (!isCopyType(data)) {
        mountData(data);
        return data as T;
    }

    // 匹配缓存数据
    const find = cache.find(ii => (ii.proxy === data || ii.rawObj === data || ii.data === data));
    if (find) {
        mountData(find.rawObj);
        return find.proxy as T;
    }

    // 匹配不到，对 传入proxy 做处理
    // 场景：两个 proxy 相互赋值
    if (data._isProxy && data._raw && data._cache) {
        cache.push(data._cache);
        mountData(data._raw);
        return data as T;
    }

    const rawObj: TData = Array.isArray(data) ? [] : {};

    const proxy = new Proxy(data, {

        set (target, key, value, raw) {

            // 优先进行赋值
            const v = Reflect.set(target, key, deepProxy(value, cb, cache, rawObj, key), raw);

            const cbType = (target as any)[key] === undefined ? 'create' : 'modify';
            cb?.(cbType, {target, key, value, raw});

            return v;
        },
        deleteProperty (target, key) {

            // delete rawObj[key];
            cb?.('delete', {target, key});

            return Reflect.deleteProperty(target, key);
        },
    });

    const cacheItem = {
        // 生成的 proxy
        proxy,
        // 生成的 新对象（拷贝的
        rawObj,
        // 代理中的对象
        data,
    };

    mountData(rawObj);

    // 把 proxy 和 复制出来的对象 进行绑定
    cache.push(cacheItem);

    Object.defineProperties(proxy, {
        _raw: {
            // writable: false,
            enumerable: false,
            get () {
                return rawObj;
            },
        },
        _isProxy: {
            // writable: false,
            enumerable: false,
            value: true,
        },
        _cache: {
            enumerable: false,
            get () {
                return cacheItem;
            },
        },
    });

    // 深度代理 proxy
    for (const key in data) {
        rawObj[key] = data[key];
        data[key] = deepProxy(data[key], cb, cache, rawObj, key);
    }

    return proxy;
};

/**
 * 对非引用类型数据进行监听 同vue3 ref
 * @param {*} val 非引用类型 值
 * @param {*} cb 设置时候触发
 * @returns proxy
 */
export const deepValue = <T extends TData = TData>(val: T, cb?: TCb2) => {
    const obj = {value: val};
    const proxy = new Proxy(obj, {
        set (target, key, value, raw) {
            // 优先进行赋值
            const v = Reflect.set(target, key, value, raw);

            if (key === 'value') {
                cb?.({target, key, value, raw});
            }

            return v;
        },
    });

    return proxy;
};

type TObj = {[key: string | number | symbol]: any};
type TArr = any[];
type TData = TObj | TArr;
export type TRData = {
    /**
     * 代理标识
     */
    _isProxy?: boolean,
    /**
     * 原生数据
     */
    _raw?: any,
    /**
     * 缓存数据
     */
    _cache?: any
} & TData;
type TCbData = {
    target: TData;
    key: number | string | symbol;
    value?: any;
    raw?: any;
};
export type TCb = (cbType: 'create' | 'modify' | 'delete', obj: TCbData) => void;
export type TCb2 = (obj: TCbData) => void;


const rawToProxy = new WeakMap();
const proxyToRaw = new WeakMap();

const createProxy = <T extends TRData>(data: T, cb?: TCb) => {

    const proxy = new Proxy(data, {

        get (target, key, rawProxy) {
            let value = Reflect.get(target, key, rawProxy);

            // 创建 proxy
            if (isCopyType(value) && !proxyToRaw.has(value) && key !== '_raw') {
                value = !rawToProxy.has(value) ? createProxy(value, cb) : rawToProxy.get(value);
            }

            return value;
        },
        set (target, key, value, raw) {

            // 找出对应的 proxy
            // if (isCopyType(value) && rawToProxy.has(target)) {
            //     // target = rawToProxy.get(target);
            //     debugger;
            // }

            const v = Reflect.set(target, key, value, raw);
            // console.log(key);

            const cbType = (target as any)[key] === undefined ? 'create' : 'modify';
            cb?.(cbType, {target, key, value, raw});

            return v;
        },
        deleteProperty (target, key) {

            // delete rawObj[key];
            const v = Reflect.deleteProperty(target, key);
            cb?.('delete', {target, key});

            return v;
        },
    });

    rawToProxy.set(data, proxy);
    proxyToRaw.set(proxy, data);

    Object.defineProperties(proxy, {
        _raw: {
            // writable: false,
            enumerable: false,
            get () {
                return toRaw(proxy);
            },
        },
        // _isProxy: {
        //     // writable: false,
        //     enumerable: false,
        //     value: true,
        // },
    });

    return proxy;
};

export const toRaw = <T extends TRData>(data: T) => {
    return proxyToRaw.get(data) || data;
};

export const deepProxy2 = <T extends TRData = any>(
    data: T,
    cb?: TCb,
) => {
    // 代理第一层 proxy
    const proxy = createProxy(data, cb);

    return proxy;
};

// window.deepProxy2 = deepProxy2;
// window.test = {
//     rawToProxy,
//     proxyToRaw,
//     toRaw,
// };

