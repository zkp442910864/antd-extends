import React from 'react';
import ReactDom from 'react-dom';

import {IProps, IPropsModalFn, TObj} from '../MyModal.type';

/**
 * 创建动态渲染 dom函数
 *
 * 配合 Modal 组件使用
 * @param ComModal 组件
 * @returns 函数
 */
export const createModalFn = <T extends IPropsModalFn, K = TObj>(ComModal: React.FC<T & IProps>) => {
    return <T extends TObj>(data?: T) => {

        const div = document.createElement('div');

        document.body.appendChild(div);

        const NewComModal: any = ComModal;
        const p: Promise<K> = new Promise((rel, rej) => {
            ReactDom.render(
                <NewComModal
                    {...(data || {})}
                    afterClose={() => {
                        ReactDom.unmountComponentAtNode(div);
                        document.body.removeChild(div);
                    }}
                    no={rej}
                    yes={rel}
                />,
                div,
            );
        });

        return p;
    };

};