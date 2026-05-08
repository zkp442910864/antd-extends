
import {ButtonProps} from 'antd/lib/button';

export type TImgPosition = 'left' | 'right';

export interface IProps extends ButtonProps {
    /**
     * 图片地址
     */
    imgSrc?: string;
    /**
     * 图片位置，默认 left
     */
    imgPosition?: TImgPosition;
    /**
     * 图片宽度，默认 16
     */
    imgWidth?: number | string;
    /**
     * 图片高度，默认 16
     */
    imgHeight?: number | string;
    /**
     * 图片 alt 文本
     */
    imgAlt?: string;
    /**
     * 图片与文字的间距，默认 6
     */
    imgGap?: number | string;
}
