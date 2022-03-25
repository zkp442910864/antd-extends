const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

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
        },
    };
};

