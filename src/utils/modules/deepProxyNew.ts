import {isCopyType} from './jsCopy';

/**
    1.做第一层代理
    2.通过get 收集依赖
        检测到对象非proxy，转proxy
        TODO: 解构会触发get，把数据转成proxy
    3.然后set 时候触发依赖


    收集
        用 WeakMap 关联关系
        用 WeakMap 存回调函数
 */

const rawToProxy = new WeakMap<TData, TProxyData>();
const proxyToRaw = new WeakMap<TProxyData, TData>();
const cbDep = new WeakMap<object, Set<TCb>>();

// 主逻辑
const createProxy = <T extends TData>(data: T, cb?: TCb) => {

    const proxy = new Proxy(data, {
        /**
         * Object.keys Object.values ...
         *  获取对象中的枚举会触发 (返回对象自身的属性名
         */
        // ownKeys (target) {
        //     console.log(1);
        //     const keys = Reflect.ownKeys(target);
        //     // debugger;
        //     return keys;
        // },
        /**
         * 拦截 get
         *  判断 value 是否可以做proxy
         *      false 不做处理 (_raw 也不做处理
         *      true 判断是否存在proxy，没有就创建
         */
        get (target, key, rawProxy) {
            // console.log(2);
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
            } else if (
                ['[object Array]', '[object Object]'].includes(Object.prototype.toString.call(value))
            ) {
                /**
                 * 针对解构后的赋值
                 * 这里只处理第一层，如果是深层次的数据结构，将会导致意外
                 */
                for (const key in value) {
                    const item = value[key];
                    if (proxyToRaw.has(item)) {
                        const newItem = proxyToRaw.get(item);
                        value[key] = newItem;
                    }
                }
            }

            const v = Reflect.set(target, key, value, raw);

            /**
             * 加入 回调
             *  页面渲染, 会触发一遍get, 同时把需要深度监听的数据转proxy
             *  修改时候，就会触发
             */
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

// window.deepProxy = deepProxy;
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

