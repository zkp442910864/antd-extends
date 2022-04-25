# 组件库

[文档地址](https://zkp442910864.github.io/antd-extends/)

### 注意点

###### 依赖项
```json
    {
        "peerDependencies": {
            "antd": ">=3.0.0 || >=4.0.0",
            "react": ">=16.0.0 || >=17.0.0",
            "react-dom": ">=16.0.0 || >=17.0.0"
        },
    }
```

### tsc 打包es模块
- [资料1](https://segmentfault.com/a/1190000039852833)
- [资料2](https://segmentfault.com/a/1190000022809326)
- [资料3 - 样式处理](https://vccolombo.github.io/blog/tsc-how-to-copy-non-typescript-files-when-building/)

### babel 打包es模块
- [官网](https://www.babeljs.cn/docs/babel-cli)

### storybook 文档
- [资料1](https://segmentfault.com/a/1190000041116905)
- [官方文档](https://storybook.js.org/docs/react/writing-stories/introduction#using-args)
- [命令配置项](https://storybook.js.org/docs/react/api/cli-options)

### mock
- [mocker-api](https://www.npmjs.com/package/mocker-api)
- [mocker-api 中文文档](https://github.com/jaywcjlove/mocker-api/blob/HEAD/README-zh.md)
- [ts mock](https://zhuanlan.zhihu.com/p/72412792)
- [ts-json-schema-generator ts转jsonSchema](https://github.com/vega/ts-json-schema-generator)
- [JSON Schema 中文文档](https://json-schema.apifox.cn/)
- [使用ajv校验json-schema数据格式](https://juejin.cn/post/6916498595441016845)
```bash
    npm i mocker-api -D

    # 转换ts 文件类型
    npm i json-schema-faker ts-json-schema-generator -D
```

### storybook mock
- [msw-storybook-addon](https://storybook.js.org/addons/msw-storybook-addon)


### 执行命令
```
    // 文档
    npm run storybook

    // 运行
    npm run start

    // 打包
    npm run clear
    npm run build:umd
    npm run build:es
    npm run build:tsc-types
    npm run build:lib // 合并上面4条命令

    // 发布命令
    npm run publish:patch
```


```
    // stroybook 针对pnpm 安装
    // https://github.com/storybookjs/storybook/issues/12995#issuecomment-813630999
    mkdir monorepo-package
    pnpm init
    pnpm i svelte              # To make SB recognize the package as a svelte project
    pnpx sb init -s            # Don’t install packages, only setup the files/folders/package.json
    pnpm i                     # Manually install the new deps
    pnpm i -D @storybook/cli   # Also need this for start-storybook command
    pnpm storybook
```


### 扩展点

###### 带作用域的css
[scoped-css-loader npm地址](https://www.npmjs.com/package/scoped-css-loader?activeTab=readme) <br />
`npm i babel-plugin-react-scoped-css scoped-css-loader -D`

###### umi@2.x 项目的引入带作用域的css
```
    // chainWebpack 扩展配置
    // 路径 config\plugin.config.js
    config.module
        .rule('less')
        .use('scoped-css-loader')
        .loader('scoped-css-loader')
        .after('css-loader')
        .end();

    config.module
        .rule('less-in-node_modules')
        .use('scoped-css-loader')
        .loader('scoped-css-loader')
        .after('css-loader')
        .end();

    // 增加属性
    // 路径 config\config.js
    extraBabelPlugins: [
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
    ],

    // 最重要一步
    // cssLoaderOptions 这个属性里面要把 .scoped.less 文件过滤掉
```
