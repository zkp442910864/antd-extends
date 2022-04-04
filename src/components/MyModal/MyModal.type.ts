
import {ModalProps} from 'antd/lib/modal';

export type TObj = {[key: string]: any};
export type TText = string | number;

export interface IProps extends ModalProps {
    // onClick?: (e: any) => void;
    /**
     * 禁止固定容器高度
     */
    disabledHeight?: boolean;
    /**
     * 容器右部 的内容
     */
    childRight?: (obj: {domId: string}) => JSX.Element;
    /**
     * 容器底部 的内容
     */
    childFooter?: (obj: {domId: string}) => JSX.Element;
    /**
     * 替换 children 内容
     *
     * 传入 高度
     */
    childContent?: (obj: {maxHeight: number}) => JSX.Element;
    /**
     * 隐藏关闭按钮（右上角的 叉叉
     */
    hideCloseBtn?: boolean;
}

export interface IPropsModalFn {
    [key: string]: any;
    /**
     * 默认的销毁函数
     *
     * 要在组件中实现
     */
    afterClose: () => void;
    /**
     * 接收报错处理
     */
    no: (obj?: any) => any;
    /**
     * 接收成功处理
     */
    yes: (obj?: any) => any;
}

