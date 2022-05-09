import React from 'react';
// import {describe, expect, it} from '@jest/globals';
import {render, screen, fireEvent, cleanup, waitFor} from '@testing-library/react';
import {Button} from 'antd';

import {useStateDeep} from '../../../utils';
import Exhibit from '../';

const TextDemo = () => {
    const state = useStateDeep({
        rIf: undefined as boolean | undefined,
        rIf2: null as boolean | null,
    });

    return (
        <>
            <div>
                <Button data-testid="btn1" type="ghost" onClick={() => {state.rIf = !state.rIf;}}>rIf undefined</Button>
                <Button data-testid="btn2" type="ghost" onClick={() => {state.rIf2 = !state.rIf2;}}>rIf null</Button>
            </div>
            <Exhibit rIf={state.rIf}>
                <Button type="primary">undefined</Button>
            </Exhibit>
            <br />
            <Exhibit rIf={state.rIf2}>
                <Button type="primary">null</Button>
            </Exhibit>
            <br />
            <Exhibit>
                <Button type="primary">1111</Button>
            </Exhibit>
        </>
    );
};

const NewButton = Exhibit.packComponent(Button);
const TextDemoPackage = () => {
    const state = useStateDeep({
        rIf: true,
        rShow: false,
    });

    return (
        <>
            <div>
                <Button data-testid="ifBtn" type="ghost" onClick={() => {state.rIf = !state.rIf;}}>rIf-{state.rIf + ''}</Button>
                <Button data-testid="showBtn" onClick={() => {state.rShow = !state.rShow;}}>rShow-{state.rShow + ''}</Button>
            </div>
            <NewButton rIf={state.rIf} rShow={state.rShow} type="primary">123</NewButton>
        </>
    );
};

describe('Exhibit 测试', () => {

    it('显示/隐藏', () => {
        const {asFragment, debug} = render(<TextDemo />);

        // dom 节点快照
        // debug();

        // screen.getByText('123');

        // 输出快照
        // expect(asFragment()).toMatchSnapshot();

        // console.log(queryByText('123')?.textContent);

        // expect(queryByText('123')).toHaveTextContent('123');

        // 显示
        fireEvent.click(screen.getByTestId('btn1'));
        expect(screen.queryByText('undefined')).toHaveTextContent('undefined');

        fireEvent.click(screen.getByTestId('btn2'));
        expect(screen.queryByText('null')).toHaveTextContent('null');

        // 隐藏
        fireEvent.click(screen.getByTestId('btn1'));
        expect(screen.queryByText('undefined')).toBeNull();

        fireEvent.click(screen.getByTestId('btn2'));
        expect(screen.queryByText('null')).toBeNull();

        // 默认展示
        expect(screen.queryByText('1111')).toHaveTextContent('1111');
    });

    it('显示/隐藏-高阶函数', () => {
        const {container} = render(<TextDemoPackage />);

        expect(screen.queryByText('123')).toHaveTextContent('123');
        expect(container.querySelector('[style="display: none;"]')).toHaveTextContent('123');

        // if 隐藏
        fireEvent.click(screen.getByTestId('ifBtn'));
        expect(screen.queryByText('123')).toBeNull();

        // if 展示
        fireEvent.click(screen.getByTestId('ifBtn'));
        // shou 展示
        fireEvent.click(screen.getByTestId('showBtn'));

        expect(container.querySelector('[style=""]')).toHaveTextContent('123');
        expect(screen.queryByText('123')).toHaveTextContent('123');

    });
});
