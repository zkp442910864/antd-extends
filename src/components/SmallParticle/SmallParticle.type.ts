

export type TChange = (newVal?: any) => void;
export type TObj = {[key: string]: any};
export type TSyncDataFn = () => void;

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
