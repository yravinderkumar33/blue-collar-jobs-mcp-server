import { v4 as uuidv4 } from 'uuid';

interface ResponseParams {
  err?: string;
  status?: 'SUCCESSFUL' | 'FAILED';
  errmsg?: string;
}

interface BuildResponsePayloadOptions {
  id: string;
  result?: any;
  responseCode?: string;
  params?: ResponseParams;
}

export function buildResponsePayload({
  id,
  result = {},
  responseCode = 'OK',
  params = {},
}: BuildResponsePayloadOptions) {
  const isError = params.status === 'FAILED';
  return {
    id,
    ver: '1.0',
    ets: Date.now(),
    params: {
      msgid: uuidv4(),
      err: params.err || (isError ? 'INTERNAL_ERROR' : ''),
      status: params.status || (isError ? 'FAILED' : 'SUCCESSFUL'),
      errmsg: params.errmsg || (isError ? 'Internal Server Error' : ''),
    },
    responseCode: responseCode || (isError ? 'INTERNAL_ERROR' : 'OK'),
    result,
  };
} 