
const globAll = require('glob-all');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// css 树摇
const PurgeCSSPlugin = require('purgecss-webpack-plugin');

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
            new CleanWebpackPlugin(),
            // new WebpackManifestPlugin(),
            // 开启 gzip
            // new CompressionWebpackPlugin(),

            // import './index.scoped.less'; 这种的好像直接被过滤了
            // new PurgeCSSPlugin({
            //     paths: globAll.sync(getFullUrl('src/**/*'), {nodir: true}),
            // }),
        ],
        optimization: {
            // https://blog.csdn.net/lin_fightin/article/details/115586812
            usedExports: true,
            minimizer: [
                '...',
                // webpack5 有默认丑化压缩
                // https://webpack.docschina.org/plugins/terser-webpack-plugin/
                // new TerserPlugin(),
                // 这个不知道为啥会提示错误
                // new OptimizeCssAssetsWebpackPlugin(),
                new CssMinimizerWebpackPlugin(),
            ],
        },
    };
};


