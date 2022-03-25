
// https://www.babeljs.cn/docs/babel-cli
// 写文件貌似没用， 只能用命令
module.exports = {
    extends: ['./babel.config'],
    include: [
        './src/tsc.ts',
    ],
    outDir: 'es',
    extensions: 'tsx',
    ignore: [
        'src/views',
        'src/stories',
        'src/router',
    ],
    copyFles: true,
};
