

export type TChange = (newVal?: any) => void;
export type TObj = {[key: string]: any};

export interface IDep {
    /**
     * 对象，做为key使用
     */
    item: TObj;
    /**
     * 执行函数
     */
    fnArr: Array<() => void>;
}

export interface IProps {
    /**
     * children内容，只接收函数
     */
    children: (value: any, change: TChange) => JSX.Element;
    /**
     * 存储数据的对象
     */
    item: TObj;
    /**
     * 对象中的key值
     */
    vmodel: string;
}
