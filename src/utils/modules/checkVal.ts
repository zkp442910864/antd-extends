import {empty, emptyArray} from './empty';
import globalConfig from '../config';

export default function checkValFun () {

    class CheckVal implements ICheckValObj {
        // eslint-disable-next-line no-undef
        [key: string]: any | TAddRuleFn;

        showToast = false;
        checkErrArr: TKeyOrErr[] = [];
        emptyKey: TKeyOrErr = {};

        constructor (emptyKey = {}, showToast = true) {
            // super();
            this.emptyKey = emptyKey;
            this.showToast = showToast;
        }

        getErrorInfo (): TKeyOrErr[] {
            return this.checkErrArr;
        }

        // 获取对应的值
        getVal (data: IOBJ, key: string) {
            let val = data;
            const arrKey = key.split('.');

            try {
                arrKey.forEach((aKey) => {
                    val = val[aKey];
                });
            } catch (error) {
                // console.log(error, '数据结构有问题，找不到指定数据');
                // throw new Error('数据结构有问题，找不到指定数据');
                return '';
            }

            return val;
        }

        run (data: IOBJ): boolean {
            const emptyKey = this.emptyKey;
            const arr: TKeyOrErr[] = [];
            // debugger;

            Object.keys(emptyKey).forEach((key) => {
                const val = this.getVal(data, key);
                let text = '';

                if (emptyKey[key] && empty(val)) {
                    text = emptyKey[key];
                } else if (emptyKey[key] && Array.isArray(val) && emptyArray(val)) {
                    text = emptyKey[key];
                } else if (typeof this[key] === 'function') {
                    text = this[key](val, data);
                }

                text && arr.push({key, text});
            });
            // console.log(arr);

            this.checkErrArr = arr;
            return this.handleInfo(arr);
        }

        handleInfo (arr: IOBJ[]): boolean {
            const text = (arr[0] || {}).text || '';
            this.showToast && text && this.toast(text);
            return !!text;
        }

        _addRule (key: string, fn: TAddRuleFn): void {
            this[key] = fn;
        }

        toast (text: string) {
            globalConfig.toast(text);
        }

        // bankCard (val: string): string {
        //     return !/^([1-9]{1})(\d{15}|\d{18})$/.test(val) ? '请输入正确银行卡号' : '';
        // }

        // phone (val: string): string {
        //     return !/^1[0-9]{10}$/.test(val) ? '请输入正确手机号' : '';
        // }

        // idCard (val: string): string {
        //     return !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val) ? '请输入正确的身份证号' : '';
        // }
    }

    return (emptyKey: IOBJ, showToast?: boolean) => {
        const check = new CheckVal(emptyKey, showToast);
        return check;
    };
}

/**
 * 创建检验对象
 * @param emptyKey {[key: string]: string}
 * @param showToast 是否显示提示 默认true
 * @returns 检验对象
 */
export const createdCheckVal: TCheckValFun = checkValFun();


interface IOBJ {
    [key: string]: any;
}

export type TKeyOrErr = {[key: string]: string};
export type TAddRuleFn = (val: any, data: IOBJ) => string;

export interface ICheckValObj {

    /**
     * 需要校验的字段，以及为空的提示
     * {name: '请输入名字'}
     */
    emptyKey: TKeyOrErr;

    /**
     * 错误数据的数组
     */
    checkErrArr: TKeyOrErr[];

    /**
     * 获取错误信息
     */
    getErrorInfo (): TKeyOrErr[];

    /**
     * 是否弹窗提示
     */
    showToast: boolean;

    /**
     * 执行函数
     */
    run (data: IOBJ): boolean;

    /**
     * 是否有错误信息
     * @param arr 错误数组
     */
    handleInfo (arr: IOBJ[]): boolean;

    /**
     * 添加新规则
     * @param key 属性字段
     * @param fn 判断函数
     */
    _addRule (key: string, fn: TAddRuleFn): void;

    /**
     * 提示函数，可重写
     * @param text 文本
     */
    toast (text: string): void;

    /**
     * 校验银行卡
     * @param val 值
     */
    // bankCard (val: string): string;

    /**
     * 校验手机号
     * @param val 值
     */
    // phone (val: string): string;

    /**
     * 校验身份证号
     * @param val 值
     */
    // idCard (val: string): string;
}

export type TCheckValFun = (emptyKey: TKeyOrErr, showToast?: boolean) => ICheckValObj;
