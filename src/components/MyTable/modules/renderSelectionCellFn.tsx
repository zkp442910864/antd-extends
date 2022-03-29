import React from 'react';

/**
 * 用来重新渲染 勾选列的函数
 *
 * 使用方式: components.body.cell 对它进行覆盖
 *
 * @param render 渲染函数
 * @returns jsx
 */
export const renderSelectionCellFn: TRenderSelectionCellFn = (render) => {
    return (props: any) => {

        // 重新渲染选择框
        if (props?.className?.includes?.('ant-table-selection-column')) {

            const {
                children,
                ...otherProps
            } = props;
            const [placeholder, expand, checkbox] = children;
            const record = checkbox._owner.pendingProps.record;

            // console.log(checkbox._owner.pendingProps.record);
            // console.log(otherProps);
            return (
                <td {...otherProps}>
                    {/* {checkbox}
                    {expand} */}
                    {render({placeholder, expand, checkbox}, record)}
                </td>
            );

        }

        return <td {...props} />;
    };
};


/**
 * 默认渲染的children 内容
 */
export interface IRawChildren {
    /**
     * 目前只知道是占位符
     */
    placeholder?: JSX.Element;
    /**
     * 这个是展开按钮，只有和勾选框在同列才有
     */
    expand?: JSX.Element;
    /**
     * 勾选框
     */
    checkbox: JSX.Element;
}
export type TRender = (rawChildren: IRawChildren, record: object) => JSX.Element;
export type TRenderSelectionCellFn = (render: TRender) => React.ReactType<any>;
