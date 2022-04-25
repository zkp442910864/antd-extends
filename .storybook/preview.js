/* eslint-disable react/react-in-jsx-scope */
import {initialize, mswDecorator} from 'msw-storybook-addon';

import Preview from './Preview.jsx';
import msw from './msw';

// mock: Initialize MSW
initialize({
    serviceWorker: {
        url: `${top.location.pathname}mockServiceWorker.js`,
    },
});

// console.log(mockData);
export const parameters = {
    // actions: {argTypesRegex: '^on[A-Z].*'},
    // https://storybook.js.org/docs/react/essentials/controls
    controls: {
        // matchers: {
        //     color: /(background|color)$/i,
        //     date: /Date$/,
        // },
        expanded: true,
    },
    // 默认文档选项卡 https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/recipes.md#migrating-from-notesinfo-addons
    viewMode: 'docs',
    // 文档全局配置
    docs: {
        description: {
            // 描述内容，可以进行覆盖
            component: '所有组件都是基于antd 组件进行二次封装',
        },
    },
    // 排序
    options: {
        storySort: (a, b) =>
            a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, {numeric: true}),
    },
    viewport: {
        disable: true,
    },
    backgrounds: {
        disable: true,
    },
    msw,
};

// 包装
// Provide the MSW addon decorator globally
export const decorators = [
    mswDecorator,
    (Story) => (
        <Preview>
            <Story />
        </Preview>
    ),
];



