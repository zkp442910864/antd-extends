import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Spin} from 'antd';
// import {} from '@storybook/addon-docs';

import {
    jsCopy, empty, sleep, throttleDebounce, emptyArray, concurrentAjax, createdCheckVal, createdCacheAjax,
    deepProxy, toRaw,
} from './index';

export default {
    title: '工具/其它',
    // component: Button,
    parameters: {
        docs: {
            description: {
                // 描述内容，可以进行覆盖
                component: '功能封装',
            },
        },
    },
};


export const Base = () => {
    return (
        <></>
    );
};
Base.storyName = '.';

export const JsCopy = () => {

    const obj = {
        a: [{w: 2}],
        dd: {
            s: {
                e: new Date(),
            },
        },
    };

    const click = () => {
        const newData = jsCopy(obj);

        console.log(obj);
        console.log(newData);
        console.log(obj.dd.s.e === newData.dd.s.e);
    };

    return (
        <div>
            <button onClick={click}>点击</button>
        </div>
    );
};
JsCopy.storyName = '1.jsCopy';
JsCopy.parameters = {
    docs: {
        description: {
            story: '深拷贝',
        },
    },
};

export const Empty = () => {

    const obj = {
        a: [{w: 2}],
        dd: {
            s: {
                e: new Date(),
            },
        },
    };

    const click = () => {
        console.log(empty(''));
        console.log(empty(null));
        console.log(empty(undefined));
        console.log(empty(0));
    };

    return (
        <div>
            <button onClick={click}>点击</button>
        </div>
    );
};
Empty.storyName = '2.empty';
Empty.parameters = {
    docs: {
        description: {
            story: '判空 以下数据都为空 \'\'|null|undefined',
        },
    },
};

export const Sleep = () => {

    const click = async () => {
        console.log(1);
        await sleep(1000);
        console.log(2);
    };

    return (
        <div>
            <button onClick={click}>点击</button>
        </div>
    );

};
Sleep.storyName = '3.sleep';
Sleep.parameters = {
    docs: {
        description: {
            story: '利用async/await 的特性,封装的睡眠函数',
        },
    },
};

export const ThrottleDebounce = () => {

    const click = throttleDebounce(() => {
        console.log(1);
    }, 1000);

    return (
        <div>
            <button onClick={click}>点击</button>
        </div>
    );

};
ThrottleDebounce.storyName = '4.throttleDebounce';
ThrottleDebounce.parameters = {
    docs: {
        description: {
            story: '结合 节流和防抖 的特性, 组合出的功能',
        },
    },
};

export const EmptyArray = () => {

    const obj = {
        a: [{w: 2}],
        dd: {
            s: {
                e: new Date(),
            },
        },
    };

    const click = () => {
        console.log(emptyArray(''));
        console.log(emptyArray(null));
        console.log(emptyArray(undefined));
        console.log(emptyArray(0));
        console.log(emptyArray([]));
        console.log(emptyArray([1, 2, 3]));
    };

    return (
        <div>
            <button onClick={click}>点击</button>
        </div>
    );
};
EmptyArray.storyName = '5.emptyArray';
EmptyArray.parameters = {
    docs: {
        description: {
            story: '数组判空 以下数据都为空 \'\'|null|undefined|[]',
        },
    },
};

export const ConcurrentAjax = () => {

    const data = useRef<any>();

    const click = () => {
        const arr: Array<() => Promise<void>> = [];
        const initNow = Date.now();
        for (let index = 0; index < 100; index++) {
            arr.push(() => {
                return new Promise((rel) => {
                    console.log(`${index}开始请求,${Date.now() - initNow}`);

                    setTimeout(() => {
                        console.log(`请求${index}完成`);
                        rel();
                    }, Math.random() * 10000);
                });
            });
        }
        data.current = concurrentAjax(arr, 5);
        data.current.start();
    };

    const stop = () => {
        data.current.stop();
    };

    return (
        <div>
            <button onClick={click}>开始</button>
            <button onClick={stop}>停止</button>
        </div>
    );
};
ConcurrentAjax.storyName = '6.concurrentAjax 并发请求控制';
ConcurrentAjax.parameters = {
    docs: {
        description: {
            story: '控制并发请求数量',
        },
    },
};

export const CreatedCheckVal = () => {

    const check = createdCheckVal({
        // 简单的空检验 ''|null|undefined|[]
        'q.ws.f': '请选择',
        qweqwe: '请输入',
        'q.ws.df': '',
    }, true);

    // 自定义校验
    check._addRule('q.ws.df', (val, data) => {
        console.log(val, data);

        return '请输入q.ws.df';
    });

    const check1 = () => {
        check.run({
            qweqwe: 'qwe',
            q: {
                ws: {
                    f: [],
                },
            },
        });
    };

    const check2 = () => {
        check.run({
            qweqwe: '',
            q: {
                ws: {
                    f: [],
                },
            },
        });
    };

    const check3 = () => {
        check.run({
            qweqwe: '123',
            q: {
                ws: {
                    f: [1],
                },
            },
        });
    };

    const check4 = () => {
        const check = createdCheckVal({
            'q.ws.f': '请选择',
            qweqwe: '请输入',
            'q.ws.df': '',
        }, false);

        check._addRule('q.ws.df', (val, data) => {
            console.log(val, data);

            return '请输入q.ws.df';
        });

        check.run({
            qweqwe: '',
            q: {
                ws: {
                    f: [],
                },
            },
        });

        console.log(check.getErrorInfo());
    };

    return (
        <div>
            <button onClick={check1}>校验数组</button>
            <button onClick={check2}>校验空</button>
            <button onClick={check3}>校验自定义</button>
            <button onClick={check4}>校验不弹提示</button>
        </div>
    );
};
CreatedCheckVal.storyName = '7.createdCheckVal 根据策略校验';
CreatedCheckVal.parameters = {
    docs: {
        description: {
            story: '校验数据',
        },
    },
};

export const CreatedCacheAjax = () => {

    const fn = (params: any, options: any) => {
        return new Promise<{data: object}>((rel) => {
            setTimeout(() => {
                rel({data: {}});
            }, 1000);
        });
    };

    const cache = createdCacheAjax(fn);

    const click = async () => {
        console.time('a');
        const res = await cache.run({a: 1, b: 2}, {
            isRCache: true,
            validityTime: 5,
        });
        console.timeEnd('a');
        console.log(res);
    };

    return (
        <div>
            <button onClick={click}>点击</button>
        </div>
    );
};
CreatedCacheAjax.storyName = '8.createdCacheAjax 数据缓存';
CreatedCacheAjax.parameters = {
    docs: {
        description: {
            story: '只缓存在内存中',
        },
    },
};

export const TDeepProxy = () => {

    const deepObj = useMemo(() => {
        return deepProxy({
            adf: {},
            a: 2,
            e: 3,
            sdf: [{e: 1}],
        }, (...arg) => {
            console.log('修改了');
            console.log(arg);
        });
    }, []);

    const click = () => {
        deepObj.sdf.push({e: 2});
        console.log(deepObj);
    };

    const click2 = () => {
        console.log(toRaw(deepObj));
    };

    return (
        <div>
            <button onClick={click}>点击</button>
            <button onClick={click2}>原对象</button>
        </div>
    );

};
TDeepProxy.storyName = '9.deepProxy/toRaw';
TDeepProxy.parameters = {
    docs: {
        description: {
            story: '深度监听, 最好不要使用解构赋值这类的操作, 会导致产生的对象变成proxy' +
                    '<br/> 副作用会产生 _raw这个属性, 可以通过这个拿到原对象, 后面废弃了, 改用toRaw',
        },
    },
};
