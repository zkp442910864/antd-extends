import {useEffect, useRef, useState, useCallback, useMemo} from 'react';

import {useStateAutoStop} from './useStateAutoStop';

/**
 * 请求 包裹
 *
 * 响应后，成功或失败 对应的另一个值都会是 null
 * @param {*} requireApi 请求 promise
 * @returns [触发函数， 请求状态，响应值，错误值]
 */

type TObj = {[key: string]: any};
type TRequireApi = (params: TObj) => Promise<TObj>;

export const useRequire = <S extends TObj = any, E extends TObj = any>(requireApi: TRequireApi) => {
    const [load, setLoad] = useStateAutoStop(false);
    const [res, setRes] = useStateAutoStop<S>();
    const [err, setErr] = useStateAutoStop<E>();

    const run: TRequireApi = (params) => {

        setLoad(true);

        return requireApi(params).then((resData) => {
            setLoad(false);
            setRes(resData as S);
            setErr();
            return resData;
        }).catch((errData) => {
            setLoad(false);
            setRes();
            setErr(errData as E);
            return errData;
        });
    };

    return [run, load, res, err];
};

