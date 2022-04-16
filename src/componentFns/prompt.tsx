import React, {FC, useRef, useEffect} from 'react';
import {InputProps} from 'antd/lib/input';

import {toast} from './toast';
import {useStateDeep, empty, jsCopy, toRaw, useDebounceEffect} from '../utils';
import {MyModal, InputTrim, createModalFn} from '../components';
import {IPropsModalFn, IProps as IMyModalProps} from '../components/MyModal/MyModal.type';

const Prompt: FC<IPrompt & IPropsModalFn & IMyModalProps> = ({
    afterClose,
    yes,
    no,
    customFn,
    customJSX,
    inputProps,
    ...modalProps
}) => {

    const ref = useRef<any>(null);
    const state = useStateDeep({
        open: true,
        loading: false,
        value: '',
        otherData: null as any,
    });

    const change = (nValue: any, ...arg: any) => {
        state.value = nValue;
        state.otherData = [nValue, ...arg];
    };

    const commit = async () => {
        if (state.loading) return;

        const value = state.value;
        const otherData = toRaw(state.otherData);
        let res: any;

        if (customFn) {
            try {
                state.loading = true;
                res = await customFn(value, otherData);
            } catch (error) {
                state.loading = false;
                // throw error;
                return;
            }
        } else if (empty(value)) {
            toast('请输入', 2);
            return;
        }

        yes?.({value, otherData, res});
        state.open = false;
    };

    useDebounceEffect(() => {
        if (ref.current) {
            // console.log(ref.current);
            ref.current?.focus();
            // ref.current?.input?.focus();
        }
    }, [ref.current]);

    return (
        <MyModal
            closable={false}
            maskClosable={false}
            width={500}
            {...modalProps}
            afterClose={afterClose}
            confirmLoading={state.loading}
            visible={state.open}
            onCancel={() => {
                state.open = false;
                no?.();
            }}
            onOk={commit}
        >
            {
                customJSX
                    ? customJSX(state.value, change, ref)
                    : (
                        <InputTrim
                            {...inputProps}
                            ref={ref}
                            value={state.value}
                            onChange={change}
                        />
                    )
            }
        </MyModal>
    );
};

export const promptFn = createModalFn<IPrompt & IMyModalProps, TReturnValue>(Prompt);


/**
 * @param newValue 值
 * @param arg 其它回调参数
 */
export type TChange = (newValue: TValue, ...arg: any) => void;
export type TValue = any;
export type TReturnValue = {
    /**
     * 输入框的值
     */
    value: TValue,
    /**
     * 附带的其他参数
     */
    otherData: any[],
    /**
     * 当 customFn 中有返回值的时候，会有值
     */
    res: any;
};

export interface IPrompt {
    /**
     * 输入框的 props
     */
    inputProps?: Omit<InputProps, 'value' | 'onChange'>,
    /**
     * 自定义JSX
     *
     * ref 用来获取组件实例, 自动焦点
     */
    customJSX?: (value: TValue, change: TChange, ref: React.MutableRefObject<any>) => JSX.Element,
    /**
     * 自定义异步函数
     *
     * 可以用来校验，通过 return Promise.reject() 来阻断执行
     *
     * 也可以做请求处理，默认会开启loading
     */
    customFn?: (value: TValue, otherArg: any[]) => Promise<any>;
}
