import React from 'react';

export type TObj = {[key: string]: any};
export type TText = string | number;
export type TBtnLocal = 'default' | 'rightTop' | 'rightBottom';

export interface MyQueryFormRef {
    /**
     * 获取表单参数
     */
    getFormData: () => TObj;
    /**
     * 设置数据进入表单
     */
    setFormData: (newParams: TObj) => void;
}

export interface IProps {
    /**
     * 初始化值
     */
    initParams?: TObj;
    /**
     * 隐藏重置按钮
     */
    hideResetBtn?: boolean;
    /**
     * 重置函数
     *
     * 传入 初始值
     */
    onReset?: (newParams: TObj) => void;
    /**
     * 重置按钮 文本
     */
    resetText?: string | JSX.Element;
    /**
     * 触发表单
     */
    onSubmit?: (page: number, newParams: TObj) => void;
    /**
     * 查询按钮 文本
     */
    submitText?: string | JSX.Element;
    /**
     * 外部 loading
     */
    loading?: boolean;
    /**
     * 配置列表
     */
    config: TConfigType[];
    /**
     * 按钮所在位置
     *
     */
    btnLocal?: TBtnLocal;
    /**
     * 紧凑类型
     */
    compact?: boolean;
    /**
     * 按钮扩展
     */
    btnExtendFn?: () => JSX.Element;
    /**
     * 在第一个 fromitem 前插入
     *
     * 直接改变对象值，会同步到组件上
     */
    formItemBeforeFn?: (params: TObj) => JSX.Element;
    /**
     * 在最后一个 fromitem 后插入
     *
     * 直接改变对象值，会同步到组件上
     */
    formItemAfterFn?: (params: TObj) => JSX.Element;
    ref?: React.Ref<any>;
    /**
     * 最后插入dom的方法
     */
    lastFn?: (params: TObj) => JSX.Element;
    /**
     * 处理 placeholder 的展示
     */
    handlePlaceholder?: (item: IConfigBase) => string;
}

export interface IConfigBase {
    /**
     * 类型
     */
    type: string;
    /**
     * 对应的标题
     */
    label?: string;
    /**
      * 标题宽度
      */
    labelWidth?: number;
    /**
     * 绑定的字段
     */
    vmodel: string | [string, string] | [string, string, string];
    placeholder?: string;
    /**
     * 清除按钮
     */
    clearable?: boolean;
    /**
     * 是否隐藏该节点
     */
    hide?: boolean;
    /**
     * 整个 ant-form-item 宽度
     *
     * 固定值，会撑下来
     *
     * 百分值，这样就不会被撑下来
     *
     * 默认 25%
     */
    itemWidth?: number | string | '25%';
    /**
     * 控件宽度
     */
    width?: number | [number?, number?, number?];
    /**
     * 选择回调
     *
     * TODO: 回调中修改 params 会影响组件内部
     */
    change?: (e: any, item: TConfigType, params: TObj) => void;
    /**
     * 样式
     */
    style?: TObj;
}


export interface ICInput extends IConfigBase{
    /**
     * 输入总长度
     */
    maxLength?: number;
    type: 'input';
    vmodel: string;
    width?: number;
}

export interface ICSelect extends IConfigBase{
    type: 'select';
    vmodel: string;
    width?: number;
    /**
     * 是否多选
     */
    multiple?: boolean;
    /**
     * 数据源
     */
    options: TObj[];
    /**
     * 显示 key
     */
    textKey?: string;
    /**
     * 值 key
     */
    valueKey?: string;
    /**
     * 开启搜索
     */
    showSearch?: boolean;
}

export interface ICSelectLoad extends IConfigBase{
    type: 'selectLoad';
    vmodel: string;
    width?: number;
    /**
     * 请求接口
     */
    requestApi: (params?: TObj) => Promise<{data: TObj[]}>;
    /**
     * 请求参数，固定
     */
    requestParams?: TObj;
    /**
     * 是否多选
     */
    multiple?: boolean;
    /**
     * 显示 key
     */
    textKey?: string;
    /**
     * 值 key
     */
    valueKey?: string;
    /**
     * 开启搜索
     */
    showSearch?: boolean;
}

export interface ICTreeSelect extends IConfigBase{
    type: 'treeSelect';
    vmodel: string;
    width?: number;
    /**
     * 数据源
     */
    treeOptions?: TObj[];
    /**
     * 请求接口
     */
    requestApi?: (params?: TObj) => Promise<{data: TObj[]}>;
    /**
     * 请求参数，固定
     */
    requestParams?: TObj;
    /**
     * 是否多选
     */
    multiple?: boolean;
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

export interface ICDateTimeRange extends IConfigBase{
    type: 'dateTimeRange';
    vmodel: [string, string];
    width?: number;
    /**
     * 展示用的 时间格式（全
     *
     * YYYY-MM-DD HH:mm:ss
     *
     * 包含 HH:mm 会自动把shouTime 置为 true
     */
    showFormat?: string;
    /**
      * 输出用的 时间格式
      */
    dateFormat?: string;
}

export interface ICGroupSelectInput extends Omit<ICSelect, 'type' | 'vmodel' | 'width'>, Omit<ICInput, 'type' | 'vmodel' | 'width'>{
    type: 'groupSelectInput';
    vmodel: [string, string];
    width?: [number, number?];
}

export interface ICGroupSelectDateTimeRange extends Omit<ICSelect, 'type' | 'vmodel' | 'width'>, Omit<ICDateTimeRange, 'type' | 'vmodel' | 'width'>{
    type: 'groupSelectDateTimeRange';
    vmodel: [string, string, string];
    width?: [number, number?, number?];
}

export interface ICCustom extends Omit<IConfigBase, 'vmodel'>{
    type: 'custom';
    render: (params: TObj) => JSX.Element;
}

export type TCMapfn = <T extends IConfigBase = IConfigBase, K extends TObj = TObj>(item: T, otherAttr: K) => JSX.Element;

export type TCFn = (params: TObj) => JSX.Element;

export type TConfigType = ICInput | ICSelect | ICSelectLoad | ICTreeSelect | ICDateTimeRange | ICGroupSelectInput | ICGroupSelectDateTimeRange | ICCustom;
