import React, {FC, useEffect, useState} from 'react';
import {Modal, ConfigProvider, Spin} from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';

import globalConfig from '../config';
import {useStateDeep, useDebounceEffect, empty} from '../../utils';
import {IProps, TText} from './MyModal.type';
import './MyModal.less';

export * from './MyModal.type';


const MyModal: FC<IProps> = (props) => {
    const {
        disabledHeight,
        childRight,
        childFooter,
        confirmLoading,
        children,
        childContent,
        width,
        visible,
        centered,
        keyboard,
        maskClosable,
        closable,
        loadingDisableClose,
        cancelButtonProps,
        ...modalProps
    } = props;

    const state = useStateDeep({
        domId: `modal-${Date.now()}-${parseInt(`${Math.random() * 10000000}`, 10)}`,
        domEl: null as null | HTMLElement | Element | undefined,
        childDomEls: null as null | HTMLCollection | undefined,
        /**
         * 内容高度是否超出容器高度
         */
        isExceed: false,
        height: 0,
    });

    const fn = useStateDeep({
        computerExceed: () => {
            if (disabledHeight) return;

            const domEl = state.domEl = document.getElementById(state.domId);
            const childDomEls = state.childDomEls = domEl?.children;
            const childHeight = Array.from(childDomEls || []).reduce((count, ii) => (count += ii.scrollHeight), 0);

            state.isExceed = childHeight > state.height;
        },
        getPopupContainer: (e?: HTMLElement) => {
            if (disabledHeight) return document.body;

            // 首先获取 dom 对象
            let domEl: null | HTMLElement | Element | undefined;
            let childDomEls: null | HTMLCollection | undefined;
            let childHeight = 0;
            const height = state.height;


            // 存在，取缓存
            if (state.domEl && state.childDomEls) {
                domEl = state.domEl;
                childDomEls = state.childDomEls;
            } else {
                domEl = document.getElementById(state.domId);
                childDomEls = domEl?.children;
            }


            // 获取 子dom高度，判断是否超出内容高度
            childHeight = Array.from(childDomEls || []).reduce((count, ii) => (count += ii.scrollHeight), 0);

            // 这里不处理，可能会导致挂载组件时候出错
            if (!e || !domEl || !childDomEls) {
                return document.body;
            }

            // 判断容器的高度是否被子容器撑大,然后使用不同的 PopupContainer
            return height >= childHeight ? document.body : domEl as HTMLElement;
        },
        handleModalWidth: (width?: TText) => {
            const innerWidth = window.innerWidth;

            if (empty(width)) {
                width = Math.max(innerWidth / 1.5, 600);
            } else if (!isNaN(+(width as TText))) {
                // 弹窗宽度不超过页面宽
                width = (width as TText) > innerWidth ? innerWidth : width;
            }

            return width;
        },
    });

    // 处理 loading时，取消按钮操作状态
    const handleLoadingStatus = () => {
        const obj = {
            keyboard,
            maskClosable,
            closable,
            cancelButtonProps,
        };

        // 都为 true 的时候，强制执行
        if (loadingDisableClose && confirmLoading) {
            obj.keyboard = false;
            obj.maskClosable = false;
            obj.closable = false;
            obj.cancelButtonProps = {
                style: {display: 'none'},
            };
        }

        return obj;
    };

    // 计算高度
    useEffect(() => {
        state.height = Math.max(document.body.clientHeight - 300, 500);
    }, []);

    // 滚动条置顶
    useDebounceEffect(() => {
        if (visible) {
            const dom = document.getElementById(state.domId);
            dom && (dom.scrollTop = 0);
            // 初始化 state.isExceed
            fn.computerExceed();
        }
    }, [visible], 0);

    return (
        <ConfigProvider getPopupContainer={fn.getPopupContainer} locale={globalConfig.getLocale() === 'en-us' ? enUS : zhCN}>

            <Modal
                {...modalProps}
                {...handleLoadingStatus()}
                centered={typeof centered === 'boolean' ? centered : state.isExceed}
                confirmLoading={confirmLoading}
                visible={visible}
                width={fn.handleModalWidth(width)}
            >
                <Spin delay={100} spinning={!!confirmLoading}>
                    <div style={{display: 'flex'}}>
                        <div
                            id={state.domId}
                            style={{
                                maxHeight: disabledHeight ? '' : state.height + 'px',
                                overflow: disabledHeight ? '' : 'auto',
                                flexGrow: 1,
                                position: 'relative',
                            }}
                        >
                            {childContent ? childContent({maxHeight: state.height}) : children}
                        </div>

                        {childRight ? childRight({domId: state.domId}) : ''}
                    </div>
                    {childFooter ? childFooter({domId: state.domId}) : ''}
                </Spin>
            </Modal>

        </ConfigProvider>
    );
};

export default MyModal;
