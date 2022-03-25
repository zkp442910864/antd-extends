
const reactRules = require('@zzzz-/eslint-config-test/src/rules/react');

module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        commonjs: true,
        es6: true,
        amd: true,
    },
    extends: [
        'plugin:react/recommended',
        '@zzzz-/eslint-config-test',
    ],
    plugins: [
        'react',
    ],
    globals: {
        JSX: true,
        // IOBJ: true,
    },
    // parserOptions: {
    //     project: './tsconfig.json',
    // },
    settings: {
        // webpack: {
        //     config: 'config/index.js',
        // },
        // 'import/resolver': {
        //     // webpack: {
        //     //     config: 'config/index.js',
        //     // },
        //     // alias: {
        //     //     map: [
        //     //         ['@', './src'],
        //     //     ],
        //     //     extensions: ['.ts', '.js', '.jsx', '.json'],
        //     // },
        //     // node: {
        //     //     paths: ['.'],
        //     //     extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        //     // },
        // },
    },
    rules: {
        ...reactRules,
        'import/no-unresolved': [2, {
            ignore: ['@/'],
            caseSensitive: true,
            caseSensitiveStrict: true,
        }],
        indent: [0],
    },
};
