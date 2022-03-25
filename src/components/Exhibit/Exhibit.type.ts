import {FC, ReactElement} from 'react';

// export interface ITestProps {
//     onClick?: (e: any) => void;
// }
export type TObj = {[key: string]: any};
export type TClassType = (props: any, context?: any) => ReactElement<any, any>;

export interface IProps {
    rIf?: true | boolean;
    rShow?: true | boolean;
    style?: {[key: string]: any};
    children?: any;
}

export interface IProps2 {
    rIf?: true | boolean;
    children?: any;
}

export type TExhibit = FC<IProps> & {packComponent: any};
