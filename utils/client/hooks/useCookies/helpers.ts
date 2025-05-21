import isEmpty from "lodash-es/isEmpty";
export const isCookieValid = <T>(cookie: T): boolean => {
  if (typeof cookie === "string" && cookie.trim() !== "") return true;
  return typeof cookie === "object" && cookie !== null && !isEmpty(cookie);
};
