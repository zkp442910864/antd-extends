
const path = require('path');

const {tsMock} = require('../../utils');

const mapData = {
    'GET /test1': (req, res) => {
        const data = tsMock('RootObject', path.resolve(__dirname, './test.d.ts'));
        return res.json(data);
    },
    'POST /test2': (req, res) => {
        const data = tsMock('RootObject', path.resolve(__dirname, './test.d.ts'));
        return res.json(data);
    },
};

module.exports = mapData;
