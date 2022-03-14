import { HttpContext } from "@nitric/sdk/lib/faas";
import Cookies from "universal-cookie";

export const getCookies = (req: HttpContext["req"]) => {
  const cookies = new Cookies(req.headers.cookie).getAll<
    Record<string, string>
  >();

  return cookies;
};

export const convertReqToNextReq = (req: HttpContext["req"]) => {
  return {
    ...req,
    body: req.data,
    cookies: getCookies(req),
  };
};
