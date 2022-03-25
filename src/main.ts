import render from './App';


render();


// https://www.webpackjs.com/api/hot-module-replacement/
// https://zhuanlan.zhihu.com/p/30135527
if (process.env.CUSTOM_NODE_ENV === 'development' && (module as any).hot) {
    // 热更新, 样式不会更新
    (module as any).hot.accept('./App', async () => {
        const app = await import('./App');
        console.log(app);
        app.default();
    });
}
