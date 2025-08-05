export type JsonifyObject<T> = {
  [P in keyof T]: T[P] extends Date
    ? string
    : T[P] extends Date | null
    ? string | null
    : T[P] extends Array<infer U>
    ? JsonifyObject<U>[]
    : T[P] extends object
    ? JsonifyObject<T[P]>
    : T[P];
};
