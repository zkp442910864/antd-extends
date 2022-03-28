/* eslint-disable no-extra-boolean-cast */
import React, {FC, forwardRef, FunctionComponent} from 'react';

import {IProps, IProps2, TObj, TClassType} from './Exhibit.type';

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
            rIf = true,
            rShow = true,
            style = {},
            ...otherProps
        } = props;

        if (!rShow) {
            style.display = 'none !important';
        }

        return (
            <>
                {!!rIf ? <Com {...otherProps} ref={ref} style={style} /> : ''}
            </>
        );
    });

    return NewCom as (props: T & IProps) => JSX.Element;
};

const Exhibit: FC<IProps2> & {packComponent: typeof packComponent} = (props: IProps2) => {
    const {rIf = true, children} = props;

    return (
        <>
            {!!rIf ? children : ''}
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
