const nitricApiSecret = process.env.NITRIC_AUTH_SECRET || "";

const nitricBaseUrl = process.env.API_BASE_URL || "";

if (!nitricApiSecret) {
  throw new Error("NITRIC_AUTH_SECRET not defined");
}

if (!nitricBaseUrl) {
  throw new Error("API_BASE_URL not defined");
}

export function stripUndefined(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => typeof value !== "undefined")
  );
}

export default async function fetcher<JSON = any>(
  info: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(
    typeof info === "string"
      ? nitricBaseUrl + info
      : {
          ...info,
          url: nitricBaseUrl + info.url,
        },
    {
      headers: {
        ...init?.headers,
        ["X-NITRIC-API"]: nitricApiSecret,
      },
      ...init,
    }
  ).then((res) => res.json());

  return res;
}
