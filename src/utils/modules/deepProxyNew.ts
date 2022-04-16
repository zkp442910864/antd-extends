import {isCopyType} from './jsCopy';


const rawToProxy = new WeakMap<TData, TProxyData>();
const proxyToRaw = new WeakMap<TProxyData, TData>();
const cbDep = new WeakMap<object, Set<TCb>>();

// 主逻辑
const createProxy = <T extends TData>(data: T, cb?: TCb) => {

    const proxy = new Proxy(data, {

        /**
         * 拦截 get
         *  判断 value 是否可以做proxy
         *      false 不做处理 (_raw 也不做处理
         *      true 判断是否存在proxy，没有就创建
         */
        get (target, key, rawProxy) {
            let value = Reflect.get(target, key, rawProxy);

            // 创建 proxy
            if (key === '_raw') {
                // 不处理
            } else if (isCopyType(value)) {
                value = rawToProxy.get(value) || createProxy(value, cb);
            }

            return value;
        },
        /**
         * 拦截 set
         *  判断 value 是否为 proxy
         *      false 不做处理
         *      true 转回原生对象，进行赋值
         *  判断 value 是否存在过 proxy
         *      true 找到对应的依赖收集器，收集回调函数
         *  触发回调
         */
        set (target, key, value, raw) {

            // 转换回原生对象，进行赋值
            if (proxyToRaw.has(value)) {
                value = proxyToRaw.get(value);
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (proxyToRaw.has(item)) {
                        const newItem = proxyToRaw.get(item);
                        value[index] = newItem;
                    }
                });
            }

            const v = Reflect.set(target, key, value, raw);
            // console.log(key);

            // 加入 回调
            if (rawToProxy.has(value) && cb) {
                const s = cbDep.get(value);
                !s?.has(cb) && s?.add(cb);
            }

            const cbType = (target as any)[key] === undefined ? 'create' : 'modify';
            triggerCb(target, cbType, {target, key, value, raw});

            return v;
        },
        deleteProperty (target, key) {

            // delete rawObj[key];
            const v = Reflect.deleteProperty(target, key);
            // cb?.('delete', {target, key});
            triggerCb(target, 'delete', {target, key});

            return v;
        },
    });

    // 兼容以前写法
    Object.defineProperties(proxy, {
        _raw: {
            enumerable: false,
            get () {
                return toRaw(proxy);
            },
        },
    });
    // Reflect.deleteProperty(proxy, '_raw', )

    // 建立双向查找
    rawToProxy.set(data, proxy);
    proxyToRaw.set(proxy, data);

    // 收集回调函数
    const set = new Set<TCb>();
    cbDep.set(data, set);
    cbDep.set(proxy, set);
    cb && set.add(cb);

    return proxy;
};

// 返回原生对象
export const toRaw = <T extends TProxyData>(data: T) => {
    const val = proxyToRaw.get(data) || data;
    return val as T;
};

// 深度监听
export const deepProxy = <T extends TData>(data: T, cb?: TCb) => {
    // 代理第一层 proxy
    const proxy = createProxy(data, cb);

    return proxy;
};

// 触发回调
const triggerCb: TtriggerCb = (target, type, obj) => {
    const set = cbDep.get(target);
    if (!set) return;

    for (const fn of set) {
        fn(type, obj);
    }
};

// window.deepProxy2 = deepProxy2;
// window.test = {
//     rawToProxy,
//     proxyToRaw,
//     toRaw,
//     cbDep,
// };


type TObj = {[key: string | number | symbol]: any};
type TArr = any[];
type TData = TObj | TArr;
export type TProxyData = {
    /**
     * 原生数据
     */
    _raw?: any,
} & TData;
type TCbType = 'create' | 'modify' | 'delete';
type TCbData = {
    target: TData;
    key: number | string | symbol;
    value?: any;
    raw?: any;
};
export type TCb = (cbType: TCbType, obj: TCbData) => void;
export type TCb2 = (obj: TCbData) => void;
export type TtriggerCb = <T extends TData>(target: T, type: TCbType, obj: TCbData) => void;

