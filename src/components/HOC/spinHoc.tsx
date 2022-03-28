import React, {FC, forwardRef} from 'react';
import {Spin} from 'antd';
import {SpinProps} from 'antd/lib/spin';

export type TObj = {[key: string]: any};

export const spinHoc = <T extends TObj = TObj>(Com: any, defaultProps: SpinProps = {}, type: 'inline' | 'out' = 'out') => {

    const NewCom = forwardRef((props: SpinProps, ref) => {
        const {
            delay,
            indicator,
            size,
            spinning,
            tip,
            wrapperClassName,
            children,
            ...otherProps
        } = props as any;

        const obj: any = Object.assign({spinning: false}, defaultProps);

        ['delay', 'indicator', 'size', 'spinning', 'tip', 'wrapperClassName'].forEach((key) => {
            if (key in props) {
                obj[key] = (props as any)[key];
            }
        });

        return type === 'inline'
            ? (
                <Com {...otherProps} ref={ref}>
                    <Spin {...obj}>
                        {children}
                    </Spin>
                </Com>
            )
            : (
                <Spin
                    {...obj}
                >
                    <Com {...otherProps} ref={ref} />
                </Spin>
            );
    });

    return NewCom as FC<T & SpinProps>;
};

