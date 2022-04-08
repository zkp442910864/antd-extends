import React from 'react';

import {useStateDeep, useDebounceEffect, empty, sleep, useStateDeepValue} from '../../utils';



const SmallParticle = (props) => {

    const {
        children,
        item,
        vmodel,
        ...otherProps
    } = props;

    const state = useStateDeepValue<any>();

    const change = (newVal) => {
        state.value = newVal;
    };

    useDebounceEffect(() => {
        state.value = item[vmodel];
    }, [item[vmodel]]);

    useDebounceEffect(() => {
        Object.defineProperty(item, vmodel, {
            get () {
                return state.value;
            },
        });
    }, [item]);

    return children(state.value, change);
};

export default SmallParticle;

