export default async function fetcher<JSON = any>(
  info: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(info, init);
  return res.json();
}
