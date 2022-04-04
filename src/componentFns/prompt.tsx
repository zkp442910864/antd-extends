import React, {FC} from 'react';
import {InputProps} from 'antd/lib/input';

import {toast} from './toast';
import {useStateDeep, empty, jsCopy} from '../utils';
import {MyModal, InputTrim, createModalFn} from '../components';
import {IPropsModalFn, IProps as IMyModalProps} from '../components/MyModal/MyModal.type';

const Prompt: FC<IPrompt & IPropsModalFn & IMyModalProps> = ({
    afterClose,
    yes,
    no,
    customCheckFn,
    customJSX,
    inputProps,
    ...modalProps
}) => {

    const state = useStateDeep({
        open: true,
        value: '',
        otherData: null as any,
    });

    const change = (nValue: any, ...arg: any) => {
        state.value = nValue;
        state.otherData = [nValue, ...arg];
    };

    const commit = async () => {
        const value = state.value;
        const otherData = state.otherData?._raw;

        if (customCheckFn) {
            await customCheckFn(value);
        } else if (empty(value)) {
            toast('请输入', 2);
            return;
        }

        yes?.({value, otherData});
        state.open = false;
    };

    return (
        <MyModal
            hideModalCloseBtn={true}
            maskClosable={false}
            width={500}
            {...modalProps}
            afterClose={afterClose}
            visible={state.open}
            onCancel={() => {
                state.open = false;
                no?.();
            }}
            onOk={commit}
        >
            {
                customJSX
                    ? customJSX(state.value, change)
                    : (
                        <InputTrim
                            {...inputProps}
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
    value: TValue,
    otherData: any[],
};

export interface IPrompt {
    /**
     * 输入框的 props
     */
    inputProps?: Omit<InputProps, 'value' | 'onChange'>,
    /**
     * 自定义JSX
     */
    customJSX?: (value: TValue, change: TChange) => JSX.Element,
    /**
     * 自定义检验函数
     *
     * 通过 返回 Promise.reject() 来报错
     */
    customCheckFn?: (value: TValue) => Promise<any>;
}
