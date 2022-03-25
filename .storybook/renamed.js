const fs = require('fs');
const path = require('path');

// try {
//     fs.unlinkSync(path.join(__dirname, '../docs'));
// } catch (error) {
//     console.log(error);
// }

try {
    fs.renameSync(path.join(__dirname, '../storybook-static'), 'docs');
} catch (error) {
    console.log(error);
}