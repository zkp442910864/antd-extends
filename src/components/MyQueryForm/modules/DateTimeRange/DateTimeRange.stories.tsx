import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import moment from 'moment';

import DateTimeRange from './index';
import {useStateDeep} from '../../../../utils';

export default {
    title: '组件/MyQueryForm(查询表单/modules/DateTimeRange(日期范围选择',
    component: DateTimeRange,
    parameters: {
        docs: {
            description: '',
        },
    },
} as ComponentMeta<typeof DateTimeRange>;

const Template: ComponentStory<typeof DateTimeRange> = (args) => <DateTimeRange {...args} />;

export const Base = Template.bind({});
Base.storyName = '基础';
Base.args = {
    // primary: true,
    // label: 'Button',
    startDateTimeStr: '2022-03-27 16:05:16',
    endDateTimeStr: '2022-03-29 16:05:16',
};
Base.argTypes = {
    onChange: {
        action: 'change',
    },
};


export const Use = () => {
    const state = useStateDeep({
        startDateTimeStr: '',
        endDateTimeStr: '',
    });

    return (
        <DateTimeRange
            endDateTimeStr={state.endDateTimeStr}
            startDateTimeStr={state.startDateTimeStr}
            onChange={(start, end) => {
                state.startDateTimeStr = start;
                state.endDateTimeStr = end;
            }}
        />
    );
};
Use.storyName = '使用';
