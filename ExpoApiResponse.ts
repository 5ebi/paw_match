// ExpoApiResponse.ts

export class ExpoApiResponse<Body = unknown> extends Response {
  constructor(body?: BodyInit | null, init: ResponseInit = {}) {
    super(body, init);
  }

  static json<JsonBody>(
    body: JsonBody,
    init?: ResponseInit,
  ): ExpoApiResponse<JsonBody> {
    return new ExpoApiResponse(JSON.stringify(body), {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
  }
}
