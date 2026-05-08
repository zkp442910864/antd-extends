import React, {FC} from 'react';
import {Button} from 'antd';

import {IProps} from './TestButton.type';
import './TestButton.less';

export * from './TestButton.type';

const TestButton: FC<IProps> = (props) => {
    const {
        imgSrc,
        imgPosition = 'left',
        imgWidth = 16,
        imgHeight = 16,
        imgAlt = '',
        imgGap = 6,
        children,
        className,
        ...btnProps
    } = props;

    const imgEl = imgSrc ? (
        <img
            alt={imgAlt}
            className="zzzz-test-button__img"
            height={imgHeight}
            src={imgSrc}
            style={{
                marginLeft: imgPosition === 'right' && children ? imgGap : undefined,
                marginRight: imgPosition === 'left' && children ? imgGap : undefined,
            }}
            width={imgWidth}
        />
    ) : null;

    return (
        <Button
            {...btnProps}
            className={`zzzz-test-button${className ? ` ${className}` : ''}`}
        >
            {imgPosition === 'left' && imgEl}
            {children}
            {imgPosition === 'right' && imgEl}
        </Button>
    );
};

export default TestButton;
