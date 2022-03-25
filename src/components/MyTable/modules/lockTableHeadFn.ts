
/**
 * 锁表头
 * @param id 表格dom id
 * @param fixedTop 固定表头距离（距离顶部距离
 * @param judgeFixedTop 判断是否需要 fixedTop
 * @param domChildId 插入的额外内容
 * @param lockChildrenFn 是否锁定额外内容
 * @returns
 */
export function lockTableHeadFn (id: string, fixedTop = 50, judgeFixedTop: (dom: HTMLElement) => boolean, domChildId: string, lockChildrenFn?: boolean) {

    const dom = document.getElementById(id) as HTMLElement;
    if (!dom) return null;

    const contentBox = dom.getElementsByClassName('ant-table-body')[0] as HTMLElement | null;
    const headBox = dom.getElementsByClassName('ant-table-thead')[0] as HTMLElement | null;
    const tbodyBox = dom.getElementsByClassName('ant-table-tbody')[0] as HTMLElement | null;
    if (!contentBox || !headBox || !tbodyBox) return null;

    const tr = headBox.getElementsByTagName('tr')[0];
    if (!tr) return null;

    const child = tr.children as unknown as HTMLElement[] | null;
    if (!child) return null;

    let othreHeight = fixedTop;

    if (!judgeFixedTop(dom)) {
        othreHeight = 0;
    }

    if (lockChildrenFn) {
        const domChild = document.getElementById(domChildId);
        othreHeight += domChild?.scrollHeight || 0;
    }

    const setStyle = (dom: HTMLElement, newStyle?: string) => {
        let initStyle = dom.getAttribute('init-style');

        // 存起来
        if (typeof initStyle !== 'string') {
            initStyle = dom.getAttribute('style') || '';
            dom.setAttribute('init-style', initStyle);
        }

        // 写进去
        if (newStyle) {
            dom.setAttribute('style', `${initStyle}${newStyle}`);
        } else {
            dom.setAttribute('style', initStyle);
        }
    };

    // 重置
    const resetHead = () => {
        headBox.setAttribute('lock', '0');
        setStyle(contentBox);
        setStyle(headBox);
        setStyle(tr);

        Array.from(child).forEach((dom) => {
            setStyle(dom);
        });

    };

    // 锁头逻辑
    const run = () => {
        const {top: offsetTop, left: offsetLeft} = contentBox.getBoundingClientRect();
        const status = headBox.getAttribute('lock');
        // let initOffsetLeft = +headBox.getAttribute('initOffsetLeft');
        // console.log(contentBox.getBoundingClientRect());

        // 锁住后，执行的逻辑
        if (status === '1') {
            // console.log(headBox);
            // if (typeof initOffsetLeft !== 'number') {
            //     initOffsetLeft = headBox.offsetLeft;
            //     headBox.setAttribute('initOffsetLeft', initOffsetLeft);
            // }

            const boxHeight = headBox.offsetHeight;
            const boxWidth = headBox.offsetWidth;
            setStyle(headBox, `width:${boxWidth}px;height:${boxHeight}px;position:fixed;top:${othreHeight}px;left:${offsetLeft + 1}px;z-index:999;`);
        }

        if (offsetTop <= othreHeight && status !== '1') {
            headBox.setAttribute('lock', '1');
            const boxHeight = headBox.offsetHeight;
            const boxWidth = headBox.offsetWidth;

            const newChild = child;

            Array.from(newChild).forEach((dom, index) => {
                const childHeight = dom.offsetHeight;
                const childWidth = dom.offsetWidth;

                setStyle(dom, `min-width:${childWidth}px;width:${childWidth}px;max-width:${childWidth}px;height:${childHeight}px;min-height:${childHeight}px;max-height:${childHeight}px;`);
            });


            setStyle(contentBox, `padding-top:${boxHeight}px;`);
            setStyle(headBox, `width:${boxWidth}px;height:${boxHeight}px;position:fixed;top:${othreHeight}px;z-index:999;`);

        } else if (offsetTop > othreHeight && status !== '0') {
            resetHead();
        }
    };

    return {
        lock: run,
        resetHead,
        closeLock () {
            resetHead();
            run();
        },
    };

    // return {lock, closeLock};
}