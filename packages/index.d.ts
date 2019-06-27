interface Context {
    request?: {
        url?: String;
        useragent?: String;
        referrer?: String;
        readyState?: String;
    };
    cookies?: Array<Object>;
    [key: string]: any;
}
