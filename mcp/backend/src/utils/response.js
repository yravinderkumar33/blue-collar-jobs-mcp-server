"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResponsePayload = buildResponsePayload;
const uuid_1 = require("uuid");
function buildResponsePayload({ id, result = {}, responseCode = 'OK', params = {}, }) {
    const isError = params.status === 'FAILED';
    return {
        id,
        ver: '1.0',
        ets: Date.now(),
        params: {
            msgid: (0, uuid_1.v4)(),
            err: params.err || (isError ? 'INTERNAL_ERROR' : ''),
            status: params.status || (isError ? 'FAILED' : 'SUCCESSFUL'),
            errmsg: params.errmsg || (isError ? 'Internal Server Error' : ''),
        },
        responseCode: responseCode || (isError ? 'INTERNAL_ERROR' : 'OK'),
        result,
    };
}
