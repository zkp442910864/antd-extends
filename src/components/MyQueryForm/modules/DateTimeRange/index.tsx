import React, {FC, useEffect} from 'react';
import {DatePicker} from 'antd';
import moment from 'moment';
import {RangePickerValue, RangePickerProps} from 'antd/lib/date-picker/interface';

import {IProps} from './index.type';
import {useStateDeep, useDebounceEffect, empty, jsCopy} from '../../../../utils';

export * from './index.type';

const DateTimeRange: FC<IProps> = (props) => {
    const {
        startDateTimeStr,
        endDateTimeStr,
        onChange,
        showFormat = 'YYYY-MM-DD HH:mm:ss',
        dateFormat = 'YYYY-MM-DD HH:mm:ss',
        showTime,
        // showTimeFormat = 'HH:mm:ss',
        ...otherProps
    } = props;

    const timeFormat = showFormat.split(' ')[1];

    // 展示数据
    const setRangePickerValue = () => {

        let value: RangePickerValue = [];
        // console.log(startDateTimeStr);
        if (startDateTimeStr && endDateTimeStr) {
            value = [moment(startDateTimeStr), moment(endDateTimeStr)];
        }

        return value;
    };

    // 时间选择回调
    const rangePickerChange = ($event: RangePickerValue) => {
        const [start, end] = $event;

        if (!start || !end) {
            onChange?.('', '');
        } else {
            onChange?.(start.format(dateFormat), end.format(dateFormat));
        }
    };

    useDebounceEffect(() => {
        // 把输出格式，同步到数据上去
        if (
            typeof startDateTimeStr === 'object' && (startDateTimeStr as any)._isAMomentObject &&
            typeof endDateTimeStr === 'object' && (endDateTimeStr as any)._isAMomentObject
        ) {
            // console.log(moment());
            onChange?.(startDateTimeStr.format(dateFormat), endDateTimeStr.format(dateFormat));
        } else if (startDateTimeStr && endDateTimeStr) {
            const newStart = moment(startDateTimeStr).format(dateFormat);
            const newEnd = moment(endDateTimeStr).format(dateFormat);
            if (!(startDateTimeStr === newStart && endDateTimeStr === newEnd)) {
                onChange?.(moment(startDateTimeStr).format(dateFormat), moment(endDateTimeStr).format(dateFormat));
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
                typeof showTime === 'boolean' ? showTime : ~showFormat.indexOf('HH:mm')
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
