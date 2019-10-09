namespace Flare {
    type ClientConfig = {
        maxGlows: number;
        maxReportsPerMinute: number;
    };

    type Context = {
        request?: {
            url?: String;
            useragent?: String;
            referrer?: String; // TODO: Flare doesn't catch this yet
            readyState?: String; // TODO: Flare doesn't catch this yet
        };
        request_data?: {
            queryString: { [key: string]: string };
        };
        git?: {
            hash?: String;
            message?: String;
            tag?: String;
            remote?: String;
            isDirty?: Boolean;
        };
        cookies?: { [key: string]: string };
        [key: string]: any;
    };

    type StackFrame = {
        line_number: number;
        column_number: number;
        method: string;
        file: string;
        code_snippet: { [key: number]: string };
        trimmed_column_number: number | null;
        class: string;
    };

    type Glow = {
        time: number;
        microtime: number;
        name: String;
        message_level: 'info' | 'debug' | 'warning' | 'error' | 'critical';
        meta_data: Array<Object>;
    };
}
