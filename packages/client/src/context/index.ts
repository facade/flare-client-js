import cookie from './cookie';
import git from './git';
import request from './request';
import requestData from './requestData';

export function collectContext(additionalContext: object): Flare.Context {
    return {
        ...cookie(),
        ...git(),
        ...request(),
        ...requestData(),
        ...additionalContext,
    };
}
