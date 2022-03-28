
import React from 'react';
import {InputNumberProps} from 'antd/lib/input-number';

export interface IProps extends Omit<InputNumberProps, 'onChange'> {
    /**
     * 小值
     */
    minValue?: number | string;
    /**
     * 大值
     */
    maxValue?: number | string;
    /**
     * 回调
     */
    onChange?: (min: number | undefined, max: number | undefined) => void;
    /**
     * 数值精度
     *
     * 默认为整数
     */
    precision?: number;
    /**
     * 数据范围 最小-最大
     */
    valueRang?: number[];
    /**
     * 同 placeholder
     */
    minPlaceholder?: string;
    maxPlaceholder?: string;
}
