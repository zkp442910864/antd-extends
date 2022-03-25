
import {SortOrder, TableSize} from 'antd/lib/table/index';

import {TBtnLocal} from './MyQueryForm/MyQueryForm';

const globalConfig = {
    tableSize: 'middle' as TableSize,
    tableSortDirections: ['descend', 'ascend'] as SortOrder[],
    tableSelectWidth: '5%',
    tableLockHeadFixedTop: 50,
    tableLockHeadJudgeFixedTop: (dom: HTMLElement) => {
        const arr = document.getElementsByClassName('ant-layout-header');
        return arr.length ? true : false;
    },
    tableShowTotal: (total: number) => {
        return `共${total}条`;
    },

    querySubmitText: '搜索',
    queryResetText: '重置',
    queryBtnLocal: 'default' as TBtnLocal,
    queryCompact: true,
    queryHandlePlaceholder: undefined,
    getLocale: () => {
        return 'zh-cn';
    },
};


export default globalConfig;
