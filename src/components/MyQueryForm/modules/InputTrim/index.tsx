import React, {FC, forwardRef} from 'react';
import {Input} from 'antd';
import {InputProps} from 'antd/lib/input';

export type TProps = Omit<InputProps, 'onChange'> & {
    onChange?: (val?: string) => void;
    ref?: any;
    // onBlur: (val?: string) => void;
};

const InputTrim: FC<TProps> = forwardRef((props: TProps, ref) => {

    const {
        value,
        onChange,
        onBlur,
        ...otherProps
    } = props;

    const change: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        // e.target.value
        onChange?.(e.target.value);
    };

    const blur: React.FocusEventHandler<HTMLInputElement> = (e) => {
        onBlur?.(e);

        const str = e.target.value || '';
        onChange?.(str.trim());
    };

    return (
        <Input
            {...otherProps}
            ref={ref as any}
            value={value}
            onBlur={blur}
            onChange={change}
        />
    );
});

export default InputTrim;
