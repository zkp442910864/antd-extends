

const mapData = {
    'GET /test1': (req, res) => {
        return res.json({
            firstName: 'Nei222l',
            lastName: 'Maverick',
        });
    },
    'POST /test2': (req, res) => {
        return res.json({
            firstName: 'Nei222l',
            lastName: 'Maverick',
        });
    },
    'POST /test3': {a: 2, e: 3},
};

module.exports = mapData;

