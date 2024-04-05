/**
 * one liner to replace classNames package,
 * taken from here: https://dev.to/gugaguichard/replace-clsx-classnames-or-classcat-with-your-own-little-helper-3bf
 * @param args
 * @returns string
 */
const cx = (...args: Array<undefined | null | string | boolean>): string =>
  args
    .flat()
    .filter((x) => x !== null && x !== undefined && typeof x !== "boolean")
    .join(" ");

export default cx;
