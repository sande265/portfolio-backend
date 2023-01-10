declare interface DataObj {
    [key: string]: any;
}

declare type ValidationType = "required" | "email" | string | object;

declare interface ValidationRuleOptions {
    [key: string]: ValidationType[]
}