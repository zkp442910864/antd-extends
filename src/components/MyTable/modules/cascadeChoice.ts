
import {SelectionSelectFn, TableRowSelection, SorterResult, TableSize, SortOrder} from 'antd/lib/table/index';

import {TObj, TText, IProps} from '../MyTable.type';

// IProps.childrenColumnName
// 设置级联选择时候，自动关联子级，或父级

export const setCascadeChoice = ({
    item,
    selected,
    selectRowKeys,
    childrenColumnName,
    parentCache,
    getRowKey,
}: TSetCascadeChoiceData) => {

    const childKey = childrenColumnName;
    const children: TObj[] = item[childKey];
    const newSelectKeys: TText[] = selectRowKeys.slice();

    if (children?.length) {
        // 向下处理
        const arr = selectChild(childKey, children, getRowKey);
        mergeSelectRowKeys(selected ? 'addKeys' : 'delKeys', arr, newSelectKeys);
    } else {
        // 向上处理
        const valueKey = getRowKey(item);
        const parentItem = parentCache[valueKey];
        if (parentItem) {
            // debugger;
            const has = parentHasChild(parentItem, selectRowKeys, childrenColumnName, getRowKey);
            mergeSelectRowKeys(has ? 'addKeys' : 'delKeys', [getRowKey(parentItem)], newSelectKeys);
        }
    }

    const set = new Set(newSelectKeys.filter(ii => ii !== -1));

    return Array.from(set);

};


// 处理数据 增/删 keys
const mergeSelectRowKeys = (type: string, actionKeys: TText[], selKeys: TText[]) => {

    if (type === 'delKeys') {
        selKeys.forEach((key, index) => {
            // 存在删除
            if (~actionKeys.indexOf(key)) {
                selKeys[index] = -1;
            }
        });
    } else {
        actionKeys.forEach((key) => {
            if (!~selKeys.indexOf(key)) {
                selKeys.push(key);
            }
        });
    }

};

// 向下操作，取出子级的ids
const selectChild = (childKey: string, children: TObj[], getRowKey: (item: TObj) => any) => {

    const handle = (list: TObj[], keyArr: TText[]) => {
        list.forEach((item) => {
            const valueKey = getRowKey(item);
            const child = item[childKey];

            keyArr.push(valueKey);

            if (child && child.length) {
                handle(child, keyArr);
            }
        });
    };

    const newKeys: TText[] = [];
    handle(children, newKeys);

    return newKeys;
};

// 向上操作- 检查子级列表是否存在选中
const parentHasChild = (parentItem: TObj, selectRowKeys: TText[], childrenColumnName: string, getRowKey: (item: TObj) => any) => {
    const childKey = childrenColumnName;
    const children: TObj[] = parentItem[childKey];

    // 子级是否存在选中项
    let has = false;
    const selArr = [];
    children.forEach((item) => {
        const valueKey = getRowKey(item);
        if (~selectRowKeys.indexOf(valueKey)) {
            has = true;
            selArr.push(1);
        }
    });

    return selArr.length === children.length;
};

type TSetCascadeChoiceData = {
    /**
     * 当前项
     */
    item: TObj;
    /**
     * 是否选中
     */
    selected: boolean;
    /**
     * 选中的keys
     */
    selectRowKeys: TText[];
    /**
     * 子级字段key
     */
    childrenColumnName: string;
    /**
     * 父级映射数据
     */
    parentCache: TObj;
    /**
     * 获取key对应value 函数
     */
    getRowKey: (item: TObj) => any;
};

