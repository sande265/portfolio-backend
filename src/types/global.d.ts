declare type Timezone = "Asia/Kathmandu" | "America/New_York" | "Asia/Singapore" | string;
declare type TimeFormat = 24 | 12 | number;

declare interface LoggerOptions {
   timezone: Timezone;
   format: TimeFormat;
}

declare interface queryParams {
   limit: number;
   sortBy?: string | undefined;
   filter?: object | any | undefined;
   page?: string | number | any | undefined;
}
