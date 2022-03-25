import React, {FC, useState} from 'react';

import {ITestProps} from './Test.type';

export * from './Test.type';

const Text: FC<ITestProps> = (props) => {
    const [a, setA] = useState(1);

    const click = () => {
        setTimeout(() => {
            setA(123132);
        }, 1000);
        // dispatch('test/assss', 1);
    };

    return (
        <div aria-label="test" className="bbb2" onClick={click}>
            <div>1231231233333</div>
            <div className="qqq">{a}</div>
            {/* <div>{stateData.ddd.success}</div> */}
            {/* <pre>{JSON.stringify(stateData, null, 4)}</pre> */}
            <div>~~~~~~~~~~~~~~~~~~~~~~~</div>
        </div>
    );
};

export default Text;
