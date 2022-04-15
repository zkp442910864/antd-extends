import React, {useEffect, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Spin} from 'antd';
// import {} from '@storybook/addon-docs';

import {toRaw} from '../modules';
import {useDebounceEffect, useDebounceFn, useRequire, useStateAutoStop, useStateDeep, useStateDeepValue} from './index';

export default {
    title: '工具/Hooks',
    // component: Button,
    parameters: {
        docs: {
            description: {
                // 描述内容，可以进行覆盖
                component: 'hooks 封装',
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

export const UseDebounceEffect = () => {

    const [val, setVal] = useState(0);
    const [after, setAfter] = useState(0);

    useDebounceEffect(() => {
        console.log('useDebounceEffect', val);
        setAfter(val);

        return () => {
            console.log('destory');
        };
    }, [val], 1000, false);

    return (
        <div>
            <button onClick={() => setVal(Math.random())}>点击{after}</button>
        </div>
    );
};
UseDebounceEffect.storyName = '1.useDebounceEffect';
UseDebounceEffect.parameters = {
    docs: {
        description: {
            story: '对 useEffect 封装' +
                '<br/> 扩展了 防抖功能 (interval)' +
                '<br/> 扩展了 初始化后是否立即执行 (immediateRun)' +
                '<br/> (fn: React.EffectCallback, deps: React.DependencyList, interval?: number, immediateRun?: boolean) => void',
        },
    },
};

export const UseDebounceFn = () => {
    const [val, setVal] = useState(0);

    const click = useDebounceFn(() => {
        setVal(Math.random());
    }, 1000);

    return (
        <div>
            <button onClick={click}>点击{val}</button>
        </div>
    );
};
UseDebounceFn.storyName = '2.useDebounceFn';
UseDebounceFn.parameters = {
    docs: {
        description: {
            story: '函数 增加防抖功能' +
                '<br/> \\<F extends TFn = TFn\\>(fn: F, interval?: number) => F',
        },
    },
};

const TestAutoStop = () => {
    const [val, setVal] = useStateAutoStop(0);

    setTimeout(() => {
        setVal(Math.random());
    }, 1000);

    return (
        <div>TestAutoStop: {val}</div>
    );
};
const Test = () => {
    const [val, setVal] = useState(0);

    setTimeout(() => {
        setVal(Math.random());
    }, 1000);

    return (
        <div>Test: {val}</div>
    );
};

export const UseStateAutoStop = () => {
    const [val, setVal] = useState(0);

    return (
        <div>
            <button onClick={() => setVal(val >= 1 ? 0 : 1)}>toggle{val}</button>
            {val >= 1 ? <TestAutoStop /> : <Test />}
        </div>
    );
};
UseStateAutoStop.storyName = '3.useStateAutoStop';
UseStateAutoStop.parameters = {
    docs: {
        description: {
            story: '组件销毁后,不在设置值,防止内存泄漏,注意控制台输出' +
                '<br/> 同 useState 使用方式',
        },
    },
};

export const UseStateDeep = () => {
    const state = useStateDeep({
        val: 0,
    });

    return (
        <div>
            <button onClick={() => (state.val = Math.random())}>toggle{state.val}</button>
            <button onClick={() => {console.log(state, toRaw(state));}}>原生对象</button>
        </div>
    );
};
UseStateDeep.storyName = '4.useStateDeep';
UseStateDeep.parameters = {
    docs: {
        description: {
            story: '类似于 vue3-reactive' +
                '<br/> 有频繁触发的风险' +
                '<br/> 深层双向绑定' +
                '<br/> 功能是通过proxy 实现,当代理了不可代理的对象会报错(比如dom',
        },
    },
};

export const UseStateDeepValue = () => {
    const state = useStateDeepValue({
        a: 1,
    });

    return (
        <div>
            <button onClick={() => (state.value = {a: Math.random()})}>toggle{JSON.stringify(state.value)}</button>
            <button onClick={() => {console.log(state.value);}}>原生对象</button>
        </div>
    );
};
UseStateDeepValue.storyName = '5.useStateDeepValue';
UseStateDeepValue.parameters = {
    docs: {
        description: {
            story: '类似于 vue3-ref' +
                '<br/> 单层双向绑定',
        },
    },
};

export const UseRequire = () => {
    const [getList, load, res, error] = useRequire((params) => {
        console.log(params);
        return new Promise((rel, rej) => {
            setTimeout(() => {
                if (Math.random() >= 0.5) {
                    rel({
                        data: '成功',
                    });
                } else {
                    rej({
                        data: '失败',
                    });
                }
            }, 1000);
        });
    });


    return (
        <div>
            <Spin spinning={load}>
                <button onClick={() => getList({a: 1})}>getList</button>
                <div>
                    res: {JSON.stringify(res)}
                </div>
                <div>
                    error: {JSON.stringify(error)}
                </div>
            </Spin>
        </div>
    );
};
UseRequire.storyName = '6.useRequire';
UseRequire.parameters = {
    docs: {
        description: {
            story: '类似于 vue3-ref' +
                '<br/> \\<S extends TObj = any, E extends TObj = any\\>(requireApi: TRequireApi) => [TRequireApi, boolean, S, E]',
        },
    },
};


// export const WithCounter = () => {
//     return <button>qwe</button>;
// };
// WithCounter.storyName = 'with counter';
// WithCounter.parameters = {
//     docs: {
//         description: {
//             story: 'This demonstrates react hooks working inside stories. **Go team!** 🚀',
//         },
//     },
// };
