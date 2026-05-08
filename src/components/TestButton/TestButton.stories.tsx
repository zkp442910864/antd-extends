import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import TestButton from './TestButton';

export default {
    title: '组件/TestButton(图片按钮)',
    component: TestButton,
    parameters: {
        docs: {
            description: {
                component: '基于 antd Button 二次封装，支持在按钮内嵌入图片，可配置图片位置（左/右）、尺寸及与文字的间距。',
            },
        },
    },
    argTypes: {
        imgPosition: {
            control: {type: 'radio'},
            options: ['left', 'right'],
        },
    },
} as ComponentMeta<typeof TestButton>;

const Template: ComponentStory<typeof TestButton> = (args) => <TestButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    children: '基础按钮',
    imgSrc: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    imgPosition: 'left',
    imgWidth: 16,
    imgHeight: 16,
    imgGap: 6,
};
Primary.storyName = '1.基础用法';

export const ImgLeft = () => (
    <TestButton
        imgSrc="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        imgPosition="left"
        type="primary"
    >
        图片在左
    </TestButton>
);
ImgLeft.storyName = '2.图片在左';

export const ImgRight = () => (
    <TestButton
        imgSrc="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        imgPosition="right"
        type="primary"
    >
        图片在右
    </TestButton>
);
ImgRight.storyName = '3.图片在右';

export const ImgOnly = () => (
    <TestButton
        imgSrc="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        imgAlt="logo"
        imgWidth={24}
        imgHeight={24}
        shape="circle"
        type="primary"
    />
);
ImgOnly.storyName = '4.纯图片按钮';

export const CustomSize = () => (
    <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
        <TestButton
            imgSrc="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            imgWidth={12}
            imgHeight={12}
            size="small"
        >
            小尺寸
        </TestButton>
        <TestButton
            imgSrc="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            imgWidth={16}
            imgHeight={16}
        >
            默认尺寸
        </TestButton>
        <TestButton
            imgSrc="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            imgWidth={24}
            imgHeight={24}
            size="large"
        >
            大尺寸
        </TestButton>
    </div>
);
CustomSize.storyName = '5.图片尺寸适配按钮大小';

export const ButtonTypes = () => (
    <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
        <TestButton
            imgSrc="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            type="primary"
        >
            Primary
        </TestButton>
        <TestButton
            imgSrc="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            type="default"
        >
            Default
        </TestButton>
        <TestButton
            imgSrc="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            type="dashed"
        >
            Dashed
        </TestButton>
        <TestButton
            imgSrc="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            type="link"
        >
            Link
        </TestButton>
        <TestButton
            imgSrc="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            disabled
        >
            Disabled
        </TestButton>
    </div>
);
ButtonTypes.storyName = '6.按钮类型';
