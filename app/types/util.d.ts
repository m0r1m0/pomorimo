type APIResponseJson<T extends Record<string, any>> = {
  [key in keyof T]: T[key] extends Date
    ? string
    : T[key] extends Record<string, any>
    ? APIResponseJson<T[key]>
    : T[key];
};
