
// 每个接口对应一个缓存对象
// 每个缓存对象最多缓存(不同数据) cacheMax 条数据
// 数据缓存时间 validityTime 分钟

import {jsCopy} from './jsCopy';


class CacheAjax<T extends IOBJ = IOBJ, K extends IOptions = IOBJ, J extends IReturnData = IOBJ> {
    private promiseAjax: IMyPromiseAjax<T, K, J>;
    private cacheMax: number;
    private cacheData: IMyCacheData;

    constructor(promiseAjax: IMyPromiseAjax<T, K, J>, cacheMax?: number) {
        this.promiseAjax = promiseAjax;
        this.cacheMax = cacheMax || 10;
        this.cacheData = {count: 0};
        // this.clearAllCache();
    }

    // 清空缓存
    clearAllCache () {
        this.cacheData = {count: 0};
    }

    // 创建key值
    createKey (data: IOBJ | string) {
        return typeof data === 'object' ? JSON.stringify(data) : data;
    }

    // 进行存储
    wCache (index: string, data: IOBJ) {
        if (this.cacheData.count > this.cacheMax) {
            this.delHead();
        } else {
            this.cacheData.count++;
        }
        this.cacheData[index] = data;
    }

    // 读存储
    rCache (index: string) {
        return this.cacheData[index] as IOBJ | null;
    }

    // 删除指定存储
    dCache (index: string) {
        delete this.cacheData[index];
    }

    // 删除前面的缓存数据
    delHead () {
        const arr = Object.entries(this.cacheData);
        arr.splice(0, 1);
        const obj: IMyCacheData = {count: arr.length};
        arr.forEach(item => {
            obj[item[0]] = item[1];
        });
        this.cacheData = obj;
    }

    // 判断数据是否过期
    isOver (data: IOBJ, validityTime: number) {
        const s = (Date.now() - data.cacheTime) / 1000;
        if (s > 60 * validityTime) {
            return false;
        } else {
            return true;
        }
    }

    // 执行
    run (params: T, options: K & IOptions) {
        return new Promise((rel, rej) => {
            // debugger;
            const key = this.createKey(params);
            const item = this.rCache(key);
            const {isRCache = false, validityTime = 5} = options;

            delete options.isRCache;
            delete options.validityTime;

            if (isRCache && item && this.isOver(item, validityTime)) {
                const data = jsCopy(item);
                data.clearCache = () => this.dCache(key);
                // 切分任务，避免线程卡顿
                setTimeout(() => {
                    rel(data as J);
                }, 100);
            } else {
                this.promiseAjax(params, options).then((res) => {

                    // 开启功能时候，才进行存储
                    if (isRCache) {
                        const data = jsCopy(res);
                        data.cacheTime = Date.now();
                        this.wCache(key, data);
                        res.clearCache = () => this.dCache(key);
                    }

                    rel(res as J);
                }).catch((err) => {
                    rej(err);
                });
            }
        });
    }
}

export const createdCacheAjax: TCreatedCacheAjax = (promiseAjax, cacheMax?: number) => {
    const cache = new CacheAjax(promiseAjax, cacheMax);
    return cache;
};


interface IOBJ {
    [key: string]: any;
}

export interface IReturnData {
    clearCache?: () => void;
    /**
     * 缓存初始时间
     */
    cacheTime?: number;
}

export interface IOptions {
    /**
     * 是否读取缓存
     */
    isRCache?: boolean;
    /**
     * 缓存时效
     */
    validityTime?: number;
}


export interface IMyCacheData {
    [key: string]: IOBJ | number;
    count: number;
}

export type IMyPromiseAjax<T extends IOBJ, K extends IOptions, J> = (params: T, options: K) => Promise<J & IReturnData>;

export type TCreatedCacheAjax<T extends IOBJ = IOBJ, K extends IOptions = IOBJ, J extends IReturnData = IOBJ> =
    (promiseAjax: IMyPromiseAjax<T, K, J>, cacheMax?: number) => CacheAjax<T, K, J>;

