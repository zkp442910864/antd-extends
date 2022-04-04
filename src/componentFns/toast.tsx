import {message} from 'antd';

/**
 * 弱提示
 * @param text 提示文本
 * @param status 非必填，1:success 2:warn 3:error, 默认info
 * @returns undefined
 */
export const toast = (text: string | number, status?: number) => {
    if (status === 1) {
        message.success(text);
        return;
    }

    if (status === 2) {
        message.warn(text);
        return;
    }

    if (status === 3) {
        message.error(text);
        return;
    }

    message.info(text);
};

