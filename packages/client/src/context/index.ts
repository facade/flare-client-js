import cookie from './cookie';
import request from './request';
import requestData from './requestData';

export function collectContext(additionalContext: object): Flare.Context {
    return {
        ...cookie(),
        ...request(),
        ...requestData(),
        ...additionalContext,
    };
}
