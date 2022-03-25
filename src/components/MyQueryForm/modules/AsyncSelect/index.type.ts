import {SelectProps, LabeledValue} from 'antd/lib/select';

export type TObj = {[key: string]: any};
export type TText = string | number;
export type TRequestApi = (params?: TObj) => Promise<{data: TObj[]}>;

export interface IProps extends Omit<SelectProps, 'onChange'> {
    /**
     * 数据源
     */
    options?: TObj[];
    /**
     * 选中 key 值
     */
    valueKey?: string;
    /**
     * 展示 title 值
     */
    textKey?: string;
    /**
     * 选择框类型
     *
     * 持续扩展
     */
    dataType?: 'static' | 'load';
    /**
     * 选中回调，keys 和 值
     */
    onChange?: (key?: TText | TText[] | LabeledValue | LabeledValue[], val?: TObj | TObj[]) => void;
    /**
     * 请求接口
     */
    requestApi?: TRequestApi;
    /**
     * 接口固定参数
     */
    requestParams?: TObj;
}
