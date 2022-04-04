const path = require('path');
const webpack = require('webpack');

module.exports = ({config}) => {

    // config.output.path = path.join(__dirname, '../docs');

    config.module.rules.push({
        test: /\.(less)$/,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    modules: true,
                },
            },
            {
                loader: 'scoped-css-loader',
            },
            {
                loader: 'postcss-loader',
                options: {
                },
            },
            {
                loader: 'less-loader',
                options: {
                    lessOptions: {
                        javascriptEnabled: true,
                    },
                },
            },
        ],
    });

    // config.plugins.push(
    //     new webpack.DefinePlugin({
    //         'process.env': {
    //             BUILD_TYPE: 'storybook',
    //         },
    //     }),
    // );

    // console.log(config.toString());

    return config;
};