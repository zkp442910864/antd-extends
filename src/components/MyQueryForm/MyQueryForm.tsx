import React, {FC, useImperativeHandle, forwardRef, useEffect} from 'react';
import {Form, Button, Input, Spin} from 'antd';
import {ButtonProps} from 'antd/lib/button';
import {InputProps} from 'antd/lib/input';
import moment from 'moment';

import {AsyncSelect, DateTimeRange, AsyncTreeSelect, NumberRang, InputTrim} from './modules';
import {IProps as AsyncSelectProps} from './modules/AsyncSelect';
import {IProps as DateTimeRangeProps} from './modules/DateTimeRange';
import {IProps as AsyncTreeSelectProps} from './modules/AsyncTreeSelect';
import {IProps as NumberRangProps} from './modules/NumberRang';

import globalConfig from '../config';
import Exhibit from '../Exhibit';
import {spinHoc} from '../HOC';
import {useStateDeep, useDebounceEffect, empty, jsCopy} from '../../utils';
import {
    IProps,
    TObj,
    TText,
    IConfigBase,
    ICInput,
    ICSelect,
    ICSelectLoad,
    ICDateTimeRange,
    ICTreeSelect,
    ICGroupSelectInput,
    TCMapfn,
    ICGroupSelectDateTimeRange,
    MyQueryFormRef,
    TConfigType,
    ICCustom,
    ICNumberRang,
} from './MyQueryForm.type';
import './MyQueryForm.less';

export * from './MyQueryForm.type';

// window.aaa = jsCopy;
// window.moment = moment;

const NewButton = Exhibit.packComponent<ButtonProps>(Button);
const InputGroup = Input.Group;
const FormItem = Form.Item;
const FormItemLoad = spinHoc(Form.Item, {}, 'inline');


const MyQueryForm: FC<IProps> = forwardRef((
    {
        resetText = globalConfig.queryResetText,
        submitText = globalConfig.querySubmitText,
        btnLocal = globalConfig.queryBtnLocal,
        compact = globalConfig.queryCompact,
        handlePlaceholder = globalConfig.queryHandlePlaceholder,
        hideResetBtn = false,
        loading = false,
        formBox = true,
        hideAllBtn = false,
        externalParams,
        initParams,
        onReset,
        onSubmit,
        btnExtendFn,
        config,
        formItemBeforeFn,
        formItemAfterFn,
        lastFn,
    }: IProps,
    ref,
) => {

    const state = useStateDeep({
        params: {} as TObj,
    });

    // 处理函数
    const handle = useStateDeep({
        width: (val?: number | string | any[]) => {
            if (Array.isArray(val)) return {};

            // 只处理 number | string
            if (typeof val === 'string') {
                return {
                    width: val,
                };
            }

            if (empty(val)) {
                return {
                    // flexGrow: 1,
                    width: '100%',
                };
            }

            return {
                width: val + 'px',
                minWidth: val + 'px',
            };
        },
        judgeShow: (type: string, item: TConfigType) => {
            return item.type === type && !item.hide;
        },
        createKey: (item: IConfigBase) => {
            const customItem = item as unknown as ICCustom;
            const fakeKey = typeof customItem.render === 'function' ? customItem.render.toString() : '';
            return `${item.type}-${Array.isArray(item.vmodel) ? item.vmodel.join(',') : (item.vmodel || fakeKey)}`;
        },
        placeholder: (item: IConfigBase) => {
            let str = item.placeholder;

            if (empty(str)) {
                str = '请选择';

                switch (true) {
                    case ['input', 'groupSelectInput', 'selectLoad'].includes(item.type):
                        str = '请输入';
                        break;
                }
            }

            if (handlePlaceholder) {
                str = handlePlaceholder(item);
            }

            return str;
        },
        itemChange: (val: any, key: string, other: [e: any, item: TConfigType]) => {
            // if (Array.isArray(key)) {
            //     throw new Error('数组的情况不处理，属于错误情况');
            // }
            state.params[key] = val;

            other[1]?.change?.(...other, state.params);

        },
    });

    // 配置转jsx
    const configToJsx = () => {
        const domList: JSX.Element[] = [];
        const inputGroupProps = {
            compact: compact,
        };

        // 盒子
        const renderFormItem = (item: any, childJSX: JSX.Element) => {

            return (
                <FormItem
                    className="zzzz-form-item"
                    key={handle.createKey(item)}
                    label={item.label}
                    style={handle.width(item.itemWidth || '25%')}
                >
                    {childJSX}
                </FormItem>
            );
        };

        // jsx 映射
        const map: {[key: string]: TCMapfn} = {
            input: (item, otherAttr) => (
                <InputTrim
                    allowClear={!!item.clearable}
                    placeholder={handle.placeholder(item)}
                    style={handle.width(item.width)}
                    // onBlur={(e) => {
                    //     const data = item as ICInput;
                    //     const str = e.target.value || '';
                    //     handle.itemChange(str.trim(), data.vmodel, [e, data]);
                    // }}
                    {...(item.moduleProps || {})}
                    {...otherAttr}
                />
            ),
            select: (item, otherAttr) => (
                <AsyncSelect
                    allowClear={!!item.clearable}
                    placeholder={handle.placeholder(item)}
                    style={handle.width(item.width)}
                    {...(item.moduleProps || {})}
                    {...otherAttr}
                />
            ),
            dateTimeRange: (item, otherAttr) => (
                <DateTimeRange
                    allowClear={!!item.clearable}
                    style={handle.width(item.width)}
                    {...(item.moduleProps || {})}
                    {...otherAttr}
                />
            ),
            treeSelect: (item, otherAttr) => (
                <AsyncTreeSelect
                    allowClear={!!item.clearable}
                    placeholder={handle.placeholder(item)}
                    style={handle.width(item.width)}
                    {...(item.moduleProps || {})}
                    {...otherAttr}
                />
            ),
            numberRang: (item, otherAttr) => (
                <NumberRang
                    // allowClear={!!item.clearable}
                    // placeholder={handle.placeholder(item)}
                    style={handle.width(item.width)}
                    {...(item.moduleProps || {})}
                    {...otherAttr}
                />
            ),
            // select: (item: ICInput, otherAttr: TObj = {}) => (),
        };


        config.forEach((data, index) => {

            if (handle.judgeShow('custom', data)) {
                // domList.push(data(state.params));
                const item = data as ICCustom;
                const dom = renderFormItem(
                    item,
                    item.render(state.params),
                );
                domList.push(dom);
            } else if (handle.judgeShow('input', data)) {
                // 输入 框
                const item = data as ICInput;
                const dom = renderFormItem(
                    item,
                    map.input<ICInput, InputProps>(item, {
                        maxLength: item.maxLength,
                        value: state.params[item.vmodel],
                        onChange: (e) => handle.itemChange(e, item.vmodel, [e, item]),
                    }),
                );
                domList.push(dom);
            } else if (handle.judgeShow('select', data)) {
                // 选择 框
                const item = data as ICSelect;
                const dom = renderFormItem(
                    item,
                    map.select<ICSelect, AsyncSelectProps>(item, {
                        options: item.options,
                        mode: item.multiple ? 'multiple' : 'default',
                        textKey: item.textKey,
                        valueKey: item.valueKey,
                        value: state.params[item.vmodel],
                        showSearch: item.showSearch,
                        onChange: (keys, items) => {
                            handle.itemChange(keys, item.vmodel, [{keys, items}, item]);
                        },
                    }),
                );
                domList.push(dom);
            } else if (handle.judgeShow('selectLoad', data)) {
                // 选择 框（异步
                const item = data as ICSelectLoad;
                const dom = renderFormItem(
                    item,
                    map.select<ICSelectLoad, AsyncSelectProps>(item, {
                        requestApi: item.requestApi,
                        requestParams: item.requestParams,
                        mode: item.multiple ? 'multiple' : 'default',
                        textKey: item.textKey,
                        valueKey: item.valueKey,
                        value: state.params[item.vmodel],
                        dataType: 'load',
                        onChange: (keys, items) => {
                            handle.itemChange(keys, item.vmodel, [{keys, items}, item]);
                        },
                    }),
                );
                domList.push(dom);
            } else if (handle.judgeShow('dateTimeRange', data)) {
                // 时间范围选择 框
                const item = data as ICDateTimeRange;
                const dom = renderFormItem(
                    item,
                    map.dateTimeRange<ICDateTimeRange, DateTimeRangeProps>(item, {
                        dateFormat: item.dateFormat,
                        showFormat: item.showFormat,
                        startDateTimeStr: state.params[item.vmodel[0]],
                        endDateTimeStr: state.params[item.vmodel[1]],
                        onChange: (start, end) => {
                            handle.itemChange(start, item.vmodel[0], [{start, end}, item]);
                            handle.itemChange(end, item.vmodel[1], [{start, end}, item]);
                        },
                    }),
                );
                domList.push(dom);
            } else if (handle.judgeShow('treeSelect', data)) {
                // 树选择 框
                const item = data as ICTreeSelect;
                const dom = renderFormItem(
                    item,
                    map.treeSelect<ICTreeSelect, AsyncTreeSelectProps>(item, {
                        dataField: item.dataField,
                        disabledRoot: item.disabledRoot,
                        multiple: !!item.multiple,
                        requestApi: item.requestApi,
                        requestParams: item.requestParams,
                        value: state.params[item.vmodel],
                        treeOptions: item.treeOptions,
                        onChange: (keys, items) => handle.itemChange(keys, item.vmodel, [{keys, items}, item]),
                    }),
                );
                domList.push(dom);
            } else if (handle.judgeShow('groupSelectInput', data)) {
                // 选择 输入 框
                const item = data as ICGroupSelectInput;
                item.width = (Array.isArray(item.width) ? item.width : []) as [number, number?];
                const dom = renderFormItem(
                    item,
                    (
                        <InputGroup {...inputGroupProps}>
                            {
                                map.select<ICGroupSelectInput, AsyncSelectProps>(item, {
                                    options: item.options,
                                    mode: item.multiple ? 'multiple' : 'default',
                                    textKey: item.textKey,
                                    valueKey: item.valueKey,
                                    style: handle.width(item.width[0]),
                                    value: state.params[item.vmodel[0]],
                                    allowClear: false,
                                    onChange: (keys, items) => handle.itemChange(keys, item.vmodel[0], [{keys, items}, item]),
                                })
                            }
                            {
                                map.input<ICGroupSelectInput, InputProps>(item, {
                                    maxLength: item.maxLength,
                                    style: handle.width(item.width[1]),
                                    value: state.params[item.vmodel[1]],
                                    onChange: (e) => handle.itemChange(e, item.vmodel[1], [e, item]),
                                })
                            }
                        </InputGroup>
                    ),
                );
                domList.push(dom);
            } else if (handle.judgeShow('groupSelectDateTimeRange', data)) {
                // 选择 时间范围 框
                const item = data as ICGroupSelectDateTimeRange;
                item.width = (Array.isArray(item.width) ? item.width : []) as [number, number?];
                const dom = renderFormItem(
                    item,
                    (
                        <InputGroup {...inputGroupProps}>
                            {
                                map.select<ICGroupSelectDateTimeRange, AsyncSelectProps>(item, {
                                    options: item.options,
                                    mode: item.multiple ? 'multiple' : 'default',
                                    textKey: item.textKey,
                                    valueKey: item.valueKey,
                                    style: handle.width(item.width[0]),
                                    value: state.params[item.vmodel[0]],
                                    allowClear: false,
                                    onChange: (keys, items) => handle.itemChange(keys, item.vmodel[0], [{keys, items}, item]),
                                })
                            }
                            {
                                map.dateTimeRange<ICGroupSelectDateTimeRange, DateTimeRangeProps>(item, {
                                    dateFormat: item.dateFormat,
                                    showFormat: item.showFormat,
                                    startDateTimeStr: state.params[item.vmodel[1]],
                                    endDateTimeStr: state.params[item.vmodel[2]],
                                    style: handle.width(item.width[1]),
                                    onChange: (start, end) => {
                                        handle.itemChange(start, item.vmodel[1], [{start, end}, item]);
                                        handle.itemChange(end, item.vmodel[2], [{start, end}, item]);
                                    },
                                })
                            }
                        </InputGroup>
                    ),
                );
                domList.push(dom);
            } else if (handle.judgeShow('numberRang', data)) {
                // 数值 范围框
                const item = data as ICNumberRang;
                const dom = renderFormItem(
                    item,
                    map.numberRang<ICNumberRang, NumberRangProps>(item, {
                        precision: item.precision,
                        minValue: state.params[item.vmodel[0]],
                        maxValue: state.params[item.vmodel[1]],
                        onChange: (min, max) => {
                            handle.itemChange(min, item.vmodel[0], [{min, max}, item]);
                            handle.itemChange(max, item.vmodel[1], [{min, max}, item]);
                        },
                    }),
                );
                domList.push(dom);
            }
        });

        return domList;
    };

    const renderBtnBox = (disabledFloat?: boolean) => {
        if (hideAllBtn) return (<></>);

        return (
            <FormItem
                className="zzzz-btn-box"
                style={{float: disabledFloat ? 'initial' : 'right'}}
            >
                <NewButton
                    htmlType="submit"
                    type="primary"
                    onClick={submit}
                >
                    {submitText}
                </NewButton>
                <NewButton
                    rIf={!hideResetBtn}
                    onClick={reset}
                >
                    {resetText}
                </NewButton>
                {btnExtendFn?.()}
            </FormItem>
        );
    };

    const submit: React.MouseEventHandler<HTMLElement> = (e) => {
        if (loading) return;
        e.preventDefault();
        onSubmit?.(1, jsCopy(state.params));
    };

    const reset = () => {
        if (loading) return;
        state.params = formatInitParams();
        // 等待最新的数据
        setTimeout(() => {
            onReset?.(jsCopy(state.params));
        }, 0);
    };

    const content = () => {
        return (
            <>
                {btnLocal === 'rightTop' ? renderBtnBox() : ''}
                {formItemBeforeFn?.(state.params)}
                {configToJsx()}
                {formItemAfterFn?.(state.params)}
                {btnLocal === 'rightBottom' ? renderBtnBox() : ''}
                {btnLocal === 'default' ? renderBtnBox(true) : ''}

                {/* <br clear="both" /> */}
                {
                    lastFn
                        ? (
                            <>
                                <div style={{clear: 'both', height: 0, overflow: 'hidden'}} />
                                {lastFn?.(state.params)}
                            </>
                        )
                        : ''
                }
            </>
        );
    };

    // 格式化初始化数据
    const formatInitParams = () => {
        const params = jsCopy(initParams || {});

        const handleDate = (data: TObj, format: string, sKey: string, eKey: string) => {
            data[sKey] = moment(data[sKey]).format(format);
            data[eKey] = moment(data[eKey]).format(format);
        };

        config.forEach((item) => {
            if (item.type === 'dateTimeRange') {
                const [sKey, eKey] = item.vmodel;
                const format = item.dateFormat || 'YYYY-MM-DD HH:mm:ss';
                handleDate(params, format, sKey, eKey);
            } else if (item.type === 'groupSelectDateTimeRange') {
                const [, sKey, eKey] = item.vmodel;
                const format = item.dateFormat || 'YYYY-MM-DD HH:mm:ss';
                handleDate(params, format, sKey, eKey);
            }
        });

        return params;
    };


    // 初始化值
    useEffect(() => {
        if (externalParams) {
            state.params = externalParams;
        } else {
            state.params = formatInitParams();
        }
    }, []);

    // 同步外部的 params
    useDebounceEffect(() => {
        if (externalParams) {
            state.params = externalParams;
        }
    }, [externalParams], 0, false);

    useImperativeHandle(ref, () => {
        const obj: MyQueryFormRef = {
            getFormData: () => {
                return jsCopy(state.params);
            },
            setFormData: (newParams) => {
                state.params = jsCopy(newParams);
            },
            resetFormData: (newParams) => {
                state.params = jsCopy(Object.assign({}, formatInitParams(), newParams || {}));
            },
        };

        return obj;
    });

    return (
        <>
            {
                formBox
                    ? (
                        <Form className="zzzz-form-box" layout="inline">
                            {content()}
                        </Form>
                    )
                    : (
                        <div className="zzzz-form-box">
                            {content()}
                        </div>
                    )
            }
        </>
    );
});

export const IConfigBaseFn: FC<IConfigBase> = () => <></>;
export default MyQueryForm;
