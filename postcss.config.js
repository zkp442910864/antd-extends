module.exports = {
    // 你可以指定下面提到的所有选项 https://postcss.org/api/#processoptions
    // parser: 'sugarss',
    plugins: [
        // PostCSS 插件
        // ['postcss-short', {prefix: 'x'}],
        'postcss-preset-env',
        'autoprefixer',
        // require('postcss-preset-env'),
        // require('autoprefixer'),
    ],
};
