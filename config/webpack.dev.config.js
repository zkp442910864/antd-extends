/*
 * @Author: your name
 * @Date: 2022-04-11 10:04:09
 * @LastEditTime: 2022-04-24 17:30:22
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \antd-extends\config\webpack.dev.config.js
 */
const webpack = require('webpack');
const path = require('path');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const mockerApi = require('mocker-api');

module.exports = (env, argv, config) => {
    const {
        publicPath,
        sourceMap,
        include,
        exclude,
        port,
        networkIp,
        globalLessData,
        pageTitle,
        assetsDir,
        setFileLocation,
        isDev,
        getFullUrl,
    } = config;

    const disabledMock = env.mock === 'no';

    return {
        plugins: [
            new FriendlyErrorsWebpackPlugin({
                // 成功的时候输出
                compilationSuccessInfo: {
                    messages: [`本地地址: http://localhost:${port} \n    IP 地 址: http://${networkIp}:${port}`],
                    // notes: ['123']
                },
                // 是否每次都清空控制台
                clearConsole: true,
            }),
            // 开启 hot时候，会自动添加
            new webpack.HotModuleReplacementPlugin(),
        ],
        optimization: {
            moduleIds: 'named',
            chunkIds: 'named',
        },
        devServer: {
            // webpack-dev-server 会从 output.path 中定义的目录为服务提供 bundle 文件，即，文件将可以通过 http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename] 进行访问。
            // 貌似设置成绝对路径才能正常加载页面
            publicPath: '/',
            open: false,
            port,
            host: '0.0.0.0',
            useLocalIp: true,
            inline: true,
            hot: true,
            hotOnly: true,
            stats: 'errors-only',
            quiet: true,
            before: disabledMock ? undefined : (app) => {
                mockerApi(app, path.resolve(__dirname, '../mock/index'), {
                    // 代理地址
                    // proxy: {
                    //     '/api/repos/*': 'https://api.github.com/',
                    // },
                    // 重写目标网址路径。对象键将用作RegEx来匹配路径。
                    // pathRewrite: {
                    //     '^/api/repos/': '/repos/',
                    // },
                    changeHost: true,
                });
            },
        },
    };
};

