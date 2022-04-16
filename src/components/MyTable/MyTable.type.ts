
import React from 'react';
import {ColumnProps, PaginationConfig, TableProps} from 'antd/lib/table/index';

export type TObj = {[key: string]: any};
export type TText = string | number;

/**
 * 接口数据
 */
export type TResData = {
    list: TObj[];
    orderBy?: TOrderBy;
    pagination: {
        pageSizeOptions: number[],
        pageSize: number,
        current: number,
        total: number,
    },
};

/**
 * 排序数据
 */
export type TOrderBy = {
    field?: string,
    order?: 0 | 1,
};

// 会自动反向映射
export enum EOrderMap {
    ascend = 0,
    descend = 1,
}


export type IColumn<T> = Omit<ColumnProps<T>, 'render'> & {
    /**
     * 隐藏列
     */
    hide?: boolean;
    /**
     * 列key
     */
    dataIndex: string;
    /**
     * 是否排序
     */
    sorter?: boolean | ((a: TObj, b: TObj) => number);
    /**
     * 宽用百分比
     *
     * 固定值，会导致表格展示出问题
     */
    width?: string;
    /**
     * 重写 render
     *
     * 第4个参数 增加了强制刷新的功能
     */
    render?: (text: any, item: T, index: number, forceUpdate: () => void) => JSX.Element;

};

export type TableRef = {
    /**
     * 请求数据
     */
    getList: (page?: number, pageSize?: number, sort?: TOrderBy, input?: TObj) => Promise<TResData | undefined>;
    /**
     * 指定选择项
     *
     * 这个一定要配置 rowKey 使用
     */
    assignSelectItems: (arr: TText[]) => void;
    /**
     * 清空选择项
     */
    clearSelectItems: () => void;
    /**
     * 清除列表数据
     */
    clearList: () => void;
    /**
     * 原生table对象
     *
     * 3.0 才能拿到对象
     */
    rawTableRef?: TObj | null;
    /**
     * 获取请求参数
     *
     * 返回一个对象
     *  params 数据
     *  emptyOrderBy 排序为空的标识 (自动使用 defaultSort
     */
    getAjaxData: () => {params: TObj, emptyOrderBy: boolean};
};

export interface IProps<T = TObj> extends Omit<TableProps<T>, 'columns'> {
    /**
     * 列配置
     */
    columns: IColumn<T>[];
    /**
     * 使用背景，主要针对于第二列表头进行使用的，把请求下来的数据扔到第二列表头里
     *
     * 单独处理 表头项
     */
    handleColumnItemConfig?: (colItem: IColumn<TObj>, resData: TResData) => void;
    /**
     * 禁止分页功能
     */
    disabledPage?: boolean;
    /**
     * 处理page分页配置属性
     */
    handlePageConfig?: (obj: PaginationConfig) => void;
    /**
     * 选择列的宽度
     */
    selectWidth?: '5%' | string;
    /**
     * 开启行选择的标识，同时是选择回调
     */
    rowSelectChange?: (keys: TText[], items: TObj[]) => void;
    /**
     * 禁止选择的行
     *  优先级高
     *  函数判断数据
     */
    disableRowFn?: (item: TObj) => boolean;
    /**
     * 默认排序值
     *
     * 要和 orderBy 区分开来，这只是默认请求排序
     */
    defaultSort?: TOrderBy;
    /**
     * 排序方式
     */
    sortDirections?: ('descend' | 'ascend')[];
    /**
     * 同步组件排序状态
     */
    orderByChange?: (orderBy?: TOrderBy) => void;
    /**
     * 接收外部传入排序状态
     *
     * 要和 defaultSort 区分开来，这需要显示到页面
     */
    orderBy?: TOrderBy;
    /**
     * 显示置顶按钮
     */
    showTopDiv?: boolean;
    /**
     * 开启锁表头
     */
    lockHead?: boolean;
    /**
     * 页面顶部 header 高度
     */
    lockHeadFixedTop?: number;
    /**
     * 判断页面顶部 header 是否存在
     */
    lockHeadJudgeFixedTop?:(dom: HTMLElement) => boolean;
    /**
     * 请求接口
     */
    requestApi?: (params: TObj) => Promise<TObj>;
    /**
     * 获取请求参数
     */
    getFormData?: () => TObj;
    /**
     * 同步组件 loading状态出去
     */
    loadChange?: (val: boolean) => void;
    /**
     * 处理回调数据
     */
    handleResData?: (data: TObj) => void;
    /**
     * 在表格前，插入 dom
     */
    childrenFn?: (obj: {loading: boolean, selectRowItems: TObj[]}) => JSX.Element;
    /**
     * 锁定 childrenFn 的内容
     */
    lockChildrenFn?: boolean;
    /**
     * 完整的列表数据，由组件来控制分页
     */
    list?: TObj[];
    /**
     * 同antd rowKey
     *
     * 不传，会进行默认设置
     */
    rowKey?: string | ((item: TObj) => string);
    /**
     * div 盒子样式
     */
    style?: TObj;
    /**
     * div 盒子类名
     */
    className?: string;
    // ref?: TRef;
    ref?: React.Ref<any>;
    /**
     * 自动生成 行key
     *
     * 会冗余 $extendTimeIndex 这个字段
     */
    autoRowKey?: boolean;
    /**
     * 选中主体数据的时候，自动选中所有子体数据
     */
    autoSelectChild?: boolean;
    /**
     * 简单分页展示
     *
     * total不确定的时候使用
     */
    simplePaging?: boolean;
}
