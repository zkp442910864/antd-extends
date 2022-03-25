import {TreeSelectProps} from 'antd/lib/tree-select';

export type TObj = {[key: string]: any};
export type TText = string | number;
export type TRequestApi = (params?: TObj) => Promise<{data: TObj[]}>;

export interface IProps extends Omit<TreeSelectProps<any>, 'onChange'> {
    /**
     * 树形数据
     */
    treeOptions?: TObj[],
    // value?: TText | TText[],
    onChange?: (keys: TText | TText[], items: TObj | TObj[], e: any) => void,
    /**
     * 是否多选
     */
    multiple?: boolean,
    /**
     * 请求接口
     */
    requestApi?: TRequestApi;
    /**
     * 接口固定参数
     */
    requestParams?: TObj;
    /**
     * 数据对应的 3个关键字段
     */
    dataField?: {
        titleKey: 'title' | string;
        valueKey: 'value' | string;
        childrenKey: 'children' | string;
    },
    /**
     * 禁用根节点
     */
    disabledRoot?: boolean;
}
