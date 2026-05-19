import { env } from '../config/env';

export type RequestJsonOptions<TBody> = {
  readonly method?: string;
  readonly body?: TBody;
  readonly headers?: HeadersInit;
  readonly fetcher?: typeof fetch;
};

export class HttpError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly responseBody: string | null;

  constructor(response: Response, responseBody: string | null) {
    super(`HTTP request failed with status ${response.status}`);
    this.name = 'HttpError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.responseBody = responseBody;
  }
}

export class HttpJsonParseError extends Error {
  constructor(cause: unknown) {
    super('HTTP response body is not valid JSON');
    this.name = 'HttpJsonParseError';
    this.cause = cause;
  }
}

export const requestJson = async <TResponse, TBody = unknown>(
  url: string,
  options: RequestJsonOptions<TBody> = {},
): Promise<TResponse> => {
  const { body, fetcher = fetch, headers: inputHeaders, method = 'GET' } = options;
  const headers = new Headers(inputHeaders);
  const init: RequestInit = { method, headers };

  if (body !== undefined) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    init.body = JSON.stringify(body);
  }

  const response = await fetcher(`${env.API_BASE_URL}${url}`, init);

  if (!response.ok) {
    const responseBody = await response.text().catch(() => null);

    throw new HttpError(response, responseBody);
  }

  try {
    return (await response.json()) as TResponse;
  } catch (error) {
    throw new HttpJsonParseError(error);
  }
};
