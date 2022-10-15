// const path = require('path');

const presets = [
    [
        '@babel/preset-env',
        {
            loose: true,
            // modules: false,
        },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
];

const plugins = [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-regenerator',
    [
        'babel-plugin-react-scoped-css',
        {
            // exclude: [path.resolve(__dirname, '.', '/src/assets/style/common.less')],
            // 包含 common.less 都会被过滤
            // include: '^((?!common.less).)*.(sa|sc|le|c)ss$',
            // 只对带有 scoped 名称的起作用
            include: '.scoped.(sa|sc|le|c)ss$',
        },
    ],
    // [
    //     'import',
    //     {
    //         libraryName: 'antd',
    //         libraryDirectory: 'es',
    //         style: 'css', // `style: true` 会加载 less 文件
    //     },
    // ],
];

// const isStoryBook = process.env.STORYBOOK_BUILD_TYPE === 'storybook';
// if (isStoryBook) {
//     // https://github.com/storybookjs/storybook/issues/15574#issuecomment-1005641294
//     plugins.push('babel-plugin-named-exports-order');
// }


module.exports = {
    presets,
    plugins,
};

