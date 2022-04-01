/* eslint-disable no-redeclare */


// 判断是否空

// interface IEmpty<T = any> {
//     (val: '' | null | undefined): true;
//     (val: NonNullable<T>): false;
// }

function empty2 (val: '' | null | undefined): true;
function empty2 (val: any): false;
function empty2 (val: any) {
    if (val === undefined || val === null || val === '') {
        return true;
    }
    return false;
}

export const empty = empty2;

export const emptyArray = (val: any) => {
    if (empty(val)) return true;
    if (!Array.isArray(val)) {
        console.error('判断数据，不为数组，请注意');
        return true;
    }

    if (!val.length) return true;

    return false;
};

// export {empty};
// export const empty: empty1 = (val) => {
//     // const jVal: undefined | null | '' = val;
//     if (val === undefined || val === null || val === '') {
//         return true;
//     }
//     return false;
// };



