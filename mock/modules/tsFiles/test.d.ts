
export interface RootObject {
    Template: Template;
    Countries: Country[];
}

interface Country {
    CountryName: string;
    RegionalShippingViews: RegionalShippingView[];
    CustomerId: number;
    TemplateId: number;
    CountryCode: string;
    Type: number;
    ShippingPrice: number;
    LocalShippingPrice?: any;
    IsEnabled: boolean;
    IsDeleted: boolean;
    Id: number;
}

interface RegionalShippingView {
    CountryName: number;
    RegionalShippingViews: any[];
    CustomerId: number;
    TemplateId: number;
    CountryCode: string;
    Type: number;
    ShippingPrice?: any;
    LocalShippingPrice?: any;
    IsEnabled: boolean;
    IsDeleted: boolean;
    Id: number;
}

interface Template {
    CustomerId: number;
    IsWe: boolean;
    Description: string;
    IsEnabled: boolean;
    IsDeleted: boolean;
}