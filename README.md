# 组件库

### 注意点
###### 样式需要安装依赖
[scoped-css-loader](https://www.npmjs.com/package/scoped-css-loader?activeTab=readme)
`npm i babel-plugin-react-scoped-css scoped-css-loader -D`
```
    // babel 中需要配置
    {
        plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-transform-regenerator',
        [
            'babel-plugin-react-scoped-css',
            {
                // 只对带有 scoped 名称的起作用
                include: '.scoped.(sa|sc|le|c)ss$',
            },
        ],
    }
```
```json
    // webpack 中需要针对样式，增加处理器，放在 css-loader 后面
    {
        loader: 'scoped-css-loader',
    }
```

###### 依赖项
```json
    {
        "peerDependencies": {
            "antd": ">=3.0.0",
            "babel-plugin-react-scoped-css": "1.1.1",
            "react": ">16.0.0",
            "scoped-css-loader": "^1.0.0"
        },
    }
```

###### umi 项目的引入方式


### tsc 打包es模块
- [资料1](https://segmentfault.com/a/1190000039852833)
- [资料2](https://segmentfault.com/a/1190000022809326)
- [资料3 - 样式处理](https://vccolombo.github.io/blog/tsc-how-to-copy-non-typescript-files-when-building/)

### babel 打包es模块
- [官网](https://www.babeljs.cn/docs/babel-cli)

### storybook 文档
- [资料1](https://segmentfault.com/a/1190000041116905)
- [官方文档](https://storybook.js.org/docs/react/writing-stories/introduction#using-args)


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
