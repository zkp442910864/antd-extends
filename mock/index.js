
/**
 * @todo 不支持 ts转换，别定义ts文件 (除了类型文件
 */

const fs = require('fs');
const path = require('path');

// 遍历 modules 文件夹
const contentDir = path.resolve(__dirname, './modules');
const eachFiles = (url, cache = {}) => {
    for (let child of fs.readdirSync(url)){
        if (fs.statSync(path.join(url, child)).isDirectory()){
            // console.log(1, child);
            eachFiles(path.join(url, child), cache);
        } else {
            // console.log(2, child);
            if (/.js$/.test(child)) {
                const data = require(path.join(url, child));
                Object.assign(cache, data);
            }

        }
    }

    return cache;
};

module.exports = eachFiles(contentDir);

