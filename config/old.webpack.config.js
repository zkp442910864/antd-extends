

// webpack5的变化 https://blog.csdn.net/weixin_41319237/article/details/115488032
// 版本hash 解释 https://www.cnblogs.com/heyushuo/p/8543889.html
// webpack5优化 https://juejin.cn/post/6996816316875161637

const os = require('os');
const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');


// function recursiveIssuer(m, c) {
//     const issuer = c.moduleGraph.getIssuer(m);
//     // For webpack@4 issuer = m.issuer

//     if (issuer) {
//         return recursiveIssuer(issuer, c);
//     }

//     const chunks = c.chunkGraph.getModuleChunks(m);
//     // For webpack@4 chunks = m._chunks

//     for (const chunk of chunks) {
//         return chunk.name;
//     }

//     return false;
// }


// 获得完整路径
const getFullUrl = (url) => {
    return path.resolve(__dirname, '.', url);
};

// 设置文件存放位置
const setFileLocationInit = (fileName) => {
    switch (true) {
        case /.js$/.test(fileName):
            return `js/${fileName}`;
        case /.css$/.test(fileName):
            return `css/${fileName}`;
        case '[name].[sha512:hash:base64:7].[ext]' === fileName:
            return `img/${fileName}`;
        case '[name].[sha512:hash:base64:8].[ext]' === fileName:
            return `font/${fileName}`;
        default:
            return fileName;
    }
};

// 获取ip地址
const getNetworkIp = () => {
    let needHost = ''; // 打开的host
    try {
        // 获得网络接口列表
        let network = os.networkInterfaces();
        for (let dev in network) {
            let iface = network[dev];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    needHost = alias.address;
                }
            }
        }
    } catch (e) {
        needHost = 'localhost';
    }
    return needHost;
};

const config = {
    sourceMap: true,
    publicPath: './',
    assetsDir: 'static',
    port: '3333',
    include: [getFullUrl('src')],
    exclude: [/node_modules/],
    networkIp: getNetworkIp(),
    globalLessData: getFullUrl('src/assets/style/params.less'),
    pageTitle: 'react',
};

module.exports = (env, argv) => {
    let {publicPath, sourceMap, include, exclude, port, networkIp, globalLessData, pageTitle, assetsDir} = config;
    // console.log(env, argv);
    const isDev = argv.mode === 'development';

    const setFileLocation = (fileName) => {
        return assetsDir ? `${assetsDir}/${setFileLocationInit(fileName)}` : setFileLocationInit(fileName);
    };

    if (!isDev) {
        sourceMap = false;
    }

    return {
        devtool: isDev ? 'eval-source-map' : 'eval',
        cache: {
            type: 'filesystem',
        },
        stats: {
            // colors: true,
            modules: false,
            // children: false,
            // chunks: false,
            // chunkModules: false
        },
        // devtool: 'eval-source-map',
        entry: getFullUrl('src/main.ts'),
        // entry: {
        //     main: getFullUrl('src/main.tsx'),
        //     // home: getFullUrl('src/views/home/index.less'),
        // },
        // entry: [
        //     getFullUrl('src/main.tsx'),
        //     getFullUrl('src/views/home/index.less'),
        // ],
        output: {
            path: getFullUrl('dist'),
            filename: setFileLocation('[name].[contenthash].js'),
            // chunkFilename: '[name].[contenthash].js',
            publicPath,
            pathinfo: false
        },
        module: {
            rules: [
                // ts
                {
                    test: /\.(tsx|ts)$/,
                    include,
                    exclude,
                    use: [
                        // {
                        //     loader: 'ts-loader',
                        // },
                        {
                            loader: 'babel-loader',
                        },
                        {
                            loader: 'eslint-loader',
                            options: {
                                cache: true,
                                quiet: true
                            }
                        }
                    ],
                },
                // less cs
                {
                    test: /\.(less|css)$/,
                    use: [
                        // {
                        //     loader: 'style-loader',
                        //     options: {
                        //         // singleton: true
                        //     }
                        // },
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {}
                        },
                        // {
                        //     loader: 'file-loader',
                        //     options: {
                        //         name: '[name].[contenthash].css',
                        //         options: {
                        //             // esModule: false
                        //         }
                        //     }
                        // },
                        // {
                        //     loader: 'extract-loader'
                        // },
                        {
                            loader: 'css-loader',
                            options: {
                                // esModule: true,
                                // modules: {
                                //     namedExport: true,
                                // },
                                sourceMap
                            },
                        },
                        {
                            loader: 'scoped-css-loader'
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap
                            },
                        },
                        {
                            loader: 'style-resources-loader',
                            options: {
                                patterns: globalLessData
                            }
                        }
                    ]
                },
                // 图片
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        // {
                        //     loader: 'file-loader',
                        //     options: {
                        //         // https://www.jianshu.com/p/c8d3b2a912c3
                        //         // 由file-loader版本过高引发的兼容问题，esModule选项已在4.3.0版本的文件加载器中引入，而在5.0.0版本中，默认情况下已将其设置为true。
                        //         esModule: false,
                        //         name: setFileLocation('[name].[sha512:hash:base64:7].[ext]'),
                        //     }
                        // },
                        {
                            loader: 'url-loader',
                            options: {
                                // https://www.jianshu.com/p/c8d3b2a912c3
                                // 由file-loader版本过高引发的兼容问题，esModule选项已在4.3.0版本的文件加载器中引入，而在5.0.0版本中，默认情况下已将其设置为true。
                                esModule: false,
                                // 超过 5kb的原图输出
                                limit: 5120,
                                name: setFileLocation('[name].[sha512:hash:base64:7].[ext]'),
                            }
                        }
                    ]
                },
                // 文字
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: setFileLocation('[name].[sha512:hash:base64:8].[ext]'),
                            }
                        }
                    ]
                },
            ],
        },
        plugins: [
            // new BundleAnalyzerPlugin(),
            // 默认取 output.path
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: getFullUrl('public'),
                        to: getFullUrl('dist'),
                        noErrorOnMissing: true,
                        globOptions: {
                            ignore: [
                                '**/index.html',
                            ]
                        }
                    }
                ]
            }),
            new MiniCssExtractPlugin({
                filename: setFileLocation('[name].[contenthash].css'),
                chunkFilename: setFileLocation('[id].[contenthash].css'),
            }),
            new WebpackBar({
                name: '编译进度',
                basic: false,
                // profile: true
            }),
            new FriendlyErrorsWebpackPlugin({
                // 成功的时候输出
                compilationSuccessInfo: {
                    messages: [`本地地址: http://localhost:${port} \n    IP 地 址: http://${networkIp}:${port}`],
                    // notes: ['123']
                },
                // 是否每次都清空控制台
                clearConsole: true,
            }),
            new HtmlWebpackPlugin({
                template: getFullUrl('public/index.html'),
                title: pageTitle,
                // hash: false,
                // filename: getFullUrl('dist/index.html'),
                inject: 'body',
                // scriptLoading: 'blocking',
                // chunks: ['chunk-vendors', 'app'],
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    CUSTOM_NODE_ENV: JSON.stringify(env.CUSTOM_NODE_ENV)
                }
            }),
        ],
        optimization: {
            splitChunks: {
                // chunks: 'all',
                // minSize: 20000,
                // minRemainingSize: 0,
                // minChunks: 1,
                // maxAsyncRequests: 30,
                // maxInitialRequests: 30,
                // enforceSizeThreshold: 50000,
                // cacheGroups: {
                //     defaultVendors: {
                //         test: /[\\/]node_modules[\\/]/,
                //         priority: -10,
                //         name: 'chunk-vendors',
                //         reuseExistingChunk: true,
                //     },
                //     default: {
                //         minChunks: 2,
                //         priority: -20,
                //         reuseExistingChunk: true,
                //     },
                // },
                cacheGroups: {
                    vendors: {
                        name: 'vendors',
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        priority: -20,
                        reuseExistingChunk: true
                    },
                    // app: {
                    //     test: /[\\/]src[\\/]/,
                    //     name: 'app-[name].[contenthash].js',
                    //     chunks: 'all',
                    //     priority: -19,
                    // },
                    // styles: {
                    //     name: 'styles',
                    //     type: 'css/mini-extract',
                    //     chunks: 'initial',
                    //     enforce: true,
                    // },
                    // home: {
                    //     name: 'home',
                    //     test: (m, c, entry = 'home') =>
                    //         m.constructor.name === 'CssModule' &&
                    //       recursiveIssuer(m, c) === entry,
                    //     chunks: 'all',
                    //     enforce: true,
                    // },
                }
            },
            // runtimeChunk: true
            // mangleWasmImports: true
            // 如果模块已经包含在所有父级模块中，告知 webpack 从 chunk 中检测出这些模块，或移除这些模块。
            removeAvailableModules: true,
            // chunk 为空，告知 webpack 检测或移除这些 chunk
            removeEmptyChunks: true,
            // 合并含有相同模块的 chunk
            mergeDuplicateChunks: true,
        },
        devServer: {
            // webpack-dev-server 会从 output.path 中定义的目录为服务提供 bundle 文件，即，文件将可以通过 http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename] 进行访问。
            // 貌似设置成绝对路径才能正常加载页面
            publicPath: '/',
            // 文件目录
            // contentBase: getFullUrl('dist'),
            open: false,
            port,
            // host: 'localhost',
            // host: networkIp,
            host: '0.0.0.0',
            useLocalIp: true,
            inline: true,
            stats: 'errors-only',
            quiet: true
        },
        resolve: {
            symlinks: false,
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                '@': getFullUrl('src')
            }
        },
    };
};


