import {RangePickerProps} from 'antd/lib/date-picker/interface';
import moment from 'moment';

export interface IProps extends Omit<RangePickerProps, 'onChange'> {
    /**
     * 开始时间
     */
    startDateTimeStr?: string | moment.Moment;
    /**
     * 结束时间
     */
    endDateTimeStr?: string | moment.Moment;
    /**
     * 选中回调
     */
    onChange?: (startStr: string, endStr: string) => void;
    /**
     * 展示用的 时间格式（全
     *
     * YYYY-MM-DD HH:mm:ss
     *
     * 包含 HH:mm 会自动把shouTime 置为 true
     */
    showFormat?: string;
    /**
     * 输出用的 时间格式
     */
    dateFormat?: string;
    /**
     * 展示用的 时间格式
     *
     * HH:mm:ss | HH:mm
     */
    // showTimeFormat?: string;
}
