import React, {FC, useEffect} from 'react';
import {InputNumber} from 'antd';

import {useStateDeep, empty} from '../../../../utils';
import {IProps} from './index.type';
import './index.scoped.less';

export * from './index.type';

const NumberRang: FC<IProps> = ({
    // symbol,
    minPlaceholder = '最小值',
    maxPlaceholder = '最大值',
    precision = 0,
    className = '',
    minValue,
    maxValue,
    onChange,
    valueRang,
    onBlur,
    ...otherProps
}) => {

    // const state = useStateDeep({});

    const toNum = (val: number | string | undefined) => {
        if (typeof val === 'undefined' || val === '') return undefined;
        return +val;
    };

    const change = (key: string, value?: number) => {
        const arr: Array<number | undefined> = [];

        if (key === 'minValue') {
            arr.push(value);
            arr.push(toNum(maxValue));
        } else {
            arr.push(toNum(minValue));
            arr.push(value);
        }

        onChange?.(arr[0], arr[1]);
    };

    const blur: React.FocusEventHandler<HTMLInputElement> = (...arg) => {
        onBlur?.(...arg);

        if (empty(minValue) || empty(maxValue)) return;

        if (+minValue! > +maxValue!) {
            onChange?.(+maxValue!, +minValue!);
        }
    };


    return (
        <div className="flex-box">
            <InputNumber
                {...otherProps}
                className={`flex-1 ${className}`}
                max={valueRang ? valueRang[1] : undefined}
                min={valueRang ? valueRang[0] : undefined}
                placeholder={minPlaceholder}
                precision={precision}
                value={toNum(minValue)}
                onBlur={blur}
                onChange={(e) => change('minValue', e)}
            />
            <div className="center-interval">~</div>
            <InputNumber
                {...otherProps}
                className={`flex-1 ${className}`}
                max={valueRang ? valueRang[1] : undefined}
                min={valueRang ? valueRang[0] : undefined}
                placeholder={maxPlaceholder}
                precision={precision}
                value={toNum(maxValue)}
                onBlur={blur}
                onChange={(e) => change('maxValue', e)}
            />
        </div>
    );
};

export default NumberRang;
