import React, {FC, useEffect} from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';
import {RangePickerValue, RangePickerProps} from 'antd/lib/date-picker/interface';

import {IProps} from './index.type';
import {useStateDeep, useDebounceEffect, empty, jsCopy} from '../../../../utils';

export * from './index.type';

const DateTimeRange: FC<IProps> = ({
    startDateTimeStr,
    endDateTimeStr,
    onChange,
    showFormat = 'YYYY-MM-DD HH:mm:ss',
    dateFormat = 'YYYY-MM-DD HH:mm:ss',
    showTime,
    // showTimeFormat = 'HH:mm:ss',
    ...otherProps
}) => {

    const timeFormat = showFormat.split(' ')[1];
    const isShowTime = typeof showTime === 'boolean' ? showTime : ~showFormat.indexOf('HH:mm');

    // 展示数据
    const setRangePickerValue = () => {

        let value: RangePickerValue = [];
        // console.log(startDateTimeStr);
        if (startDateTimeStr && endDateTimeStr) {
            value = [moment(startDateTimeStr), moment(endDateTimeStr)];
        }

        return value;
    };

    // 格式化时间
    const handleDateFormat = (date: moment.Moment) => {
        if (typeof dateFormat === 'string') {
            return date.format(dateFormat);
        }

        return dateFormat(date);
    };

    // 时间选择回调
    const rangePickerChange = ($event: RangePickerValue) => {
        const [start, end] = $event;

        if (!start || !end) {
            onChange?.('', '');
        } else if (isShowTime) {
            onChange?.(handleDateFormat(start), handleDateFormat(end));
        } else {
            start.startOf('days');
            end.endOf('days');
            onChange?.(handleDateFormat(start), handleDateFormat(end));
        }
    };

    useDebounceEffect(() => {
        // 把输出格式，同步到数据上去
        if (
            typeof startDateTimeStr === 'object' && (startDateTimeStr as any)._isAMomentObject &&
            typeof endDateTimeStr === 'object' && (endDateTimeStr as any)._isAMomentObject
        ) {
            // console.log(moment());
            // onChange?.(startDateTimeStr.format(dateFormat), endDateTimeStr.format(dateFormat));
            rangePickerChange([startDateTimeStr, endDateTimeStr]);
        } else if (startDateTimeStr && endDateTimeStr) {
            const newStart = handleDateFormat(moment(startDateTimeStr));
            const newEnd = handleDateFormat(moment(endDateTimeStr));
            if (!(startDateTimeStr === newStart && endDateTimeStr === newEnd)) {
                // onChange?.(moment(startDateTimeStr).format(dateFormat), moment(endDateTimeStr).format(dateFormat));
                rangePickerChange([moment(startDateTimeStr), moment(endDateTimeStr)]);
            }
        }
    }, [startDateTimeStr, endDateTimeStr]);

    return (
        <DatePicker.RangePicker
            {...otherProps}
            // allowClear={false}
            // allowClear={item.clearable}
            // disabledDate={disabledDate}
            // format={format}
            // inputReadOnly={true}
            // showTime={typeof showTime === 'boolean' ? showTime : !!~dateFormat.indexOf('HH:mm:ss')}
            format={showFormat}
            showTime={
                isShowTime
                    ? {
                        defaultValue: [moment('00:00:00', timeFormat), moment('23:59:59', timeFormat)],
                        format: timeFormat,
                    }
                    : undefined
            }
            // title={`${startDateTimeStr && endDateTimeStr ? `${startDateTimeStr}~${endDateTimeStr}` : ''}`}
            value={setRangePickerValue()}
            // onCalendarChange={rangePickerCalendarChange}
            onChange={(e) => rangePickerChange(e)}
            // onOpenChange={rangePickerOpenChange}
        />
    );
};


export default DateTimeRange;
