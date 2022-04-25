import {rest} from 'msw';

import mockData from '../mock/storybookIndex';


// 转 rest
const toMsw = (data) => {
    const mapApi = {
        get: rest.get,
        post: rest.post,
    };

    const arr = [];
    const keys = Object.keys(data);
    keys.forEach((key) => {
        const objOrFn = data[key];
        const matchData = key.match(/(\S+)\s+(\S+)/);

        let method = 'get';
        let url = key;

        if (matchData?.length) {
            method = matchData[1].toLocaleLowerCase();
            url = matchData[2];
        }

        const newFnApi = mapApi[method](url, (req, res, ctx) => {
            if (typeof objOrFn === 'function') {
                return res(
                    objOrFn(req, ctx),
                );
            } else {
                return res(
                    ctx.json(objOrFn),
                );
            }
        });

        arr.push(newFnApi);
    });

    return arr;
};

export default {
    handlers: [
        ...toMsw(mockData),
        // rest.get('/user', (req, res, ctx) => {
        //     return res(
        //         ctx.json({
        //             firstName: 'Nei222l',
        //             lastName: 'Maverick',
        //         }),
        //     );
        // }),
    ],
};
