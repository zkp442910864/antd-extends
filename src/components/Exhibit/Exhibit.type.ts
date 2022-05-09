import {FC, ReactElement} from 'react';

// export interface ITestProps {
//     onClick?: (e: any) => void;
// }
export type TObj = {[key: string]: any};
export type TClassType = (props: any, context?: any) => ReactElement<any, any>;

export interface IProps {
    /**
     * 不传时，默认true
     */
    rIf?: true | boolean | null;
    /**
     * 不传时，默认true
     */
    rShow?: true | boolean | null;
    children?: any;
}

export interface IProps2 {
    /**
     * 不传时，默认true
     */
    rIf?: true | boolean | null;
    children?: any;
}

export type TExhibit = FC<IProps> & {packComponent: any};
