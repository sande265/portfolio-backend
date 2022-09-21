declare type Timezone = "Asia/Kathmandu" | "America/New_York" | "Asia/Singapore" | string;
declare type SortBy = "asc" | "desc" | string;
declare type TimeFormat = 24 | 12 | number;

declare interface LoggerOptions {
   timezone: Timezone;
   format: TimeFormat;
}

declare interface queryParams {
   limit: number | any;
   sortBy?: SortBy;
   filter?: object | any | undefined;
   page?: string | number | any | undefined;
   search?: string | undefined;
   sortField?: any; 
}
