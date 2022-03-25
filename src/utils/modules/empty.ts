/* eslint-disable no-redeclare */


// 判断是否空

function empty2 (val: '' | null | undefined): true;
function empty2 (val: any): false;
function empty2 (val: any) {
    if (val === undefined || val === null || val === '') {
        return true;
    }
    return false;
}

export const empty = empty2;

// export {empty};
// export const empty: empty1 = (val) => {
//     // const jVal: undefined | null | '' = val;
//     if (val === undefined || val === null || val === '') {
//         return true;
//     }
//     return false;
// };



