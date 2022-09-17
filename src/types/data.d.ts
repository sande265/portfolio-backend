declare interface DataObj {
    [key: string]: any;
}

declare type ValidationType = "required" | "email" | {};

declare interface ValidationRuleOptions {
    [key: string]: ValidationType[]
}