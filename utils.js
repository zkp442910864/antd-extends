
const jsf = require('json-schema-faker');
const path = require('path');
// const ts = require('typescript');
// const {generateSchema, getProgramFromFiles} = require('typescript-json-schema');
const tsj = require('ts-json-schema-generator');
// const fs = require('fs');

module.exports = {
    tsMock (moduleName, file) {

        const config = {
            path: file,
            tsconfig: path.resolve(__dirname, '../tsconfig.json'),
            type: '*', // Or <type-name> if you want to generate schema for that one type only
        };

        const schema = tsj.createGenerator(config).createSchema(moduleName);

        return {
            data: jsf.generate(schema, []),
            rule: schema,
        };
        // return jsf.generate(schema, []);
    },
};
