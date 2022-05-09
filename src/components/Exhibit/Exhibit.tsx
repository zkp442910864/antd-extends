/* eslint-disable no-extra-boolean-cast */
import React, {FC, forwardRef, FunctionComponent} from 'react';

import {IProps, IProps2, TObj} from './Exhibit.type';

export * from './Exhibit.type';

/**
 * 装饰器
 *
 * 对组件进行包装，通过rIf 来控制是否显示
 * @param {*} Com 组件
 * @returns 返回一个新组件
 */
const packComponent = <T extends TObj = TObj>(Com: any) => {

    const NewCom = forwardRef((props: IProps, ref) => {
        const {
            rIf,
            rShow,
            style = {},
            ...otherProps
        } = props as IProps & {style: TObj};

        const curRIf = Reflect.has(props, 'rIf') ? !!rIf : true;
        const curRShow = Reflect.has(props, 'rShow') ? !!rShow : true;

        if (!curRShow) {
            style.display = 'none';
        }

        return (
            <>
                {!!curRIf ? <Com {...otherProps} ref={ref} style={style} /> : ''}
            </>
        );
    });

    return NewCom as (props: T & IProps) => JSX.Element;
};

const Exhibit: FC<IProps2> & {packComponent: typeof packComponent} = (props: IProps2) => {
    const {rIf, children} = props;

    const curRIf = Reflect.has(props, 'rIf') ? !!rIf : true;


    return (
        <>
            {curRIf ? children : ''}
        </>
    );
};

// const Aa: FC<{asd: string}> = (props) => {
//     return (
//         <div>
//             123{props.asd}
//         </div>
//     );
// };
// const NewAa = packComponent<{asd: string}>(Aa);
// const Bb = () => {
//     return (
//         <NewAa rIf={true} rShow={false} />
//     );
// };

Exhibit.packComponent = packComponent;
export default Exhibit;
