// webpack5 assetsModuleType https://blog.csdn.net/lin_fightin/article/details/115140736?utm_term=webpack5%E9%85%8D%E7%BD%AE%E5%9B%BE%E7%89%87%E8%B5%84%E6%BA%90&utm_medium=distribute.pc_aggpage_search_result.none-task-blog-2~all~sobaiduweb~default-0-115140736&spm=3001.4430


const webpack = require('webpack');
// progress-bar-webpack-plugin
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

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
        setAssetsPublicPath,
        isDev,
        getFullUrl,
        umdExternals,
        umdLibrary,
        umdFilename,
    } = config;

    const isLib = env.lib === 'umd';

    const entryAndOutput = isLib
        ? {
            entry: getFullUrl('src/umd.ts'),
            output: {
                path: getFullUrl('dist'),
                libraryTarget: 'umd',
                library: umdLibrary,
                filename: `${umdFilename}.js`,
            },
            externals: umdExternals,
        }
        : {
            entry: getFullUrl('src/main.ts'),
            output: {
                path: getFullUrl('dist'),
                filename: setFileLocation('[name].[contenthash].js'),
                chunkFilename: setFileLocation('[name].[contenthash].chunk.js'),
                publicPath,
                // assetModuleFilename: setFileLocation('[name].[hash:7][ext]'),
            },
        };

    const miniCssExtractPluginConfig = isLib
        ? {
            filename: `${umdFilename}.css`,
            chunkFilename: `${umdFilename}.css`,
        }
        : {
            filename: setFileLocation('[name].[contenthash].css'),
            chunkFilename: setFileLocation('[id].[contenthash].css'),
        };

    const optimization = isLib
        ? {}
        : {
            // 树摇
            // sideEffects: true,
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        name: 'vendors',
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },
            },
            // 如果模块已经包含在所有父级模块中，告知 webpack 从 chunk 中检测出这些模块，或移除这些模块。
            removeAvailableModules: true,
            // chunk 为空，告知 webpack 检测或移除这些 chunk
            removeEmptyChunks: true,
            // 合并含有相同模块的 chunk
            mergeDuplicateChunks: true,
        };

    return {
        ...entryAndOutput,
        // https://www.jianshu.com/p/10f2479995a4
        // TODO: browserslist 会影响到热更新
        target: isDev ? 'web' : 'browserslist',
        // https://mp.weixin.qq.com/s/-y35QBSIx2jMvG5dNklcPQ
        devtool: isDev ? 'eval-source-map' : 'nosources-source-map',
        // 缓存
        cache: {
            type: 'filesystem',
            // buildDependencies: {
            //     config: [__filename],
            // },
            // version: '1.0'
        },
        stats: {
            modules: false,
        },
        module: {
            rules: [
                // ts
                {
                    test: /\.(tsx|ts)$/,
                    include,
                    exclude,
                    use: [
                        {
                            loader: 'babel-loader',
                        },
                        // {
                        //     loader: 'html-loader',
                        //     options: {
                        //         esModule: false
                        //     }
                        // },
                        // {
                        //     loader: 'eslint-loader',
                        //     options: {
                        //         cache: true,
                        //         quiet: true,
                        //     },
                        // },
                    ],
                },
                // less cs
                (() => {
                    const use = [
                        // {
                        //     loader: MiniCssExtractPlugin.loader,
                        //     options: {}
                        // },
                        // 为了热更新有效 开发使用 style-loader
                        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap,
                            },
                        },
                        {
                            loader: 'scoped-css-loader',
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap,
                            },
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap,
                                lessOptions: {
                                    javascriptEnabled: true,
                                },
                            },
                        },
                    ];

                    globalLessData && use.push({
                        loader: 'style-resources-loader',
                        options: {
                            patterns: globalLessData,
                        },
                    });

                    return {
                        test: /\.(less|css)$/,
                        use,
                    };
                })(),
                // 图片
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    type: 'asset',
                    generator: {
                        filename: setFileLocation('[name].[hash:7][ext]'),
                        // dataUrl: (context) => {
                        //     console.log(context);
                        //     return context;
                        // },
                        publicPath: (pathData, assetInfo) => {
                            // console.log(pathData.runtime);
                            // console.log(pathData.filename);
                            /**
                             * 针对 build
                             * pathData.runtime 在样式文件中，返回的 child
                             * 代码文件中，返回 main
                             */
                            return pathData.runtime === 'child'
                                ? setAssetsPublicPath(setFileLocation('[name].[hash:7][ext]'), publicPath)
                                : publicPath;
                        },
                    },
                    parser: {
                        dataUrlCondition: {
                            // 超过 5kb的原图输出
                            maxSize: 1024 * 5,
                        },
                    },
                    // use: [
                    //     {
                    //         loader: 'url-loader',
                    //         options: {
                    //             // https://www.jianshu.com/p/c8d3b2a912c3
                    //             // 由file-loader版本过高引发的兼容问题，esModule选项已在4.3.0版本的文件加载器中引入，而在5.0.0版本中，默认情况下已将其设置为true。
                    //             esModule: false,
                    //             // 超过 5kb的原图输出
                    //             limit: 5120,
                    //             name: setFileLocation('[name].[sha512:hash:base64:7].[ext]'),
                    //         }
                    //     },
                    // ]
                },
                // 文字
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: 'asset',
                    generator: {
                        filename: setFileLocation('[name].[hash:8][ext]'),
                        publicPath: setAssetsPublicPath(setFileLocation('[name].[hash:8][ext]'), publicPath),
                    },
                    parser: {
                        dataUrlCondition: {
                            // 超过 50kb的原图输出
                            maxSize: 1024 * 50,
                        },
                    },
                    // use: [
                    //     {
                    //         loader: 'file-loader',
                    //         options: {
                    //             name: setFileLocation('[name].[sha512:hash:base64:8].[ext]'),
                    //         }
                    //     }
                    // ]
                },
                // {
                //     test: /.html$/,
                //     loader: 'html-loader',
                //     options: {
                //         esModule: false,
                //         options: {
                //             attrs: ['img:src', ':style']
                //         }
                //     }
                // }
            ],
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: getFullUrl('public'),
                        to: getFullUrl('dist'),
                        noErrorOnMissing: true,
                        globOptions: {
                            ignore: [
                                '**/index.html',
                            ],
                        },
                    },
                ],
            }),
            new MiniCssExtractPlugin(miniCssExtractPluginConfig),
            new WebpackBar({
                name: '进度',
                basic: false,
                // profile: true
            }),
            new HtmlWebpackPlugin({
                template: getFullUrl('public/index.html'),
                title: pageTitle,
                inject: 'body',
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    CUSTOM_NODE_ENV: JSON.stringify(env.CUSTOM_NODE_ENV),
                },
            }),
            new ESLintPlugin({
                cache: true,
                quiet: true,
            }),
        ],
        optimization,
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.json'],
            alias: {
                '@': getFullUrl('src'),
            },
        },
    };
};


