import React, {FC} from 'react';

/**
 * 创建假函数，处理部分ts类型不显示的问题
 *
 * demo:
 *
 *  export const IConfigBaseFn = createTypeFn<IConfigBase>();
 *
 *  .stories.tsx 默认导出的内容里增加该属性
 *  subcomponents: {IConfigBase: IConfigBaseFn}
 *
 */
export const createTypeFn = <T extends object>() => {
    return (() => {
        const fn = () => <></>;
        fn.storyName = '.';
        return fn;
    })() as FC<T>;
};