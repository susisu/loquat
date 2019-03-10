"use strict";

module.exports = () => {
  // TODO: add mappings for other control characters
  const escapeMap = new Map([
    ["\\", "\\\\"],
    ["\"", "\\\""],
    ["\b", "\\b"],
    ["\f", "\\f"],
    ["\n", "\\n"],
    ["\r", "\\r"],
    ["\t", "\\t"],
    ["\v", "\\v"],
  ]);

  /**
   * escapeChar: (char: string) => string
   */
  function escapeChar(char) {
    return escapeMap.has(char) ? escapeMap.get(char) : char;
  }

  /**
   * show: (val: any) => string
   *
   * Pretty-prints a val. This function is mainly used for printing error messages and debugging
   * purposes.
   */
  function show(val) {
    if (typeof val === "string") {
      // optimize performance for singleton case
      return val.length === 1 ? `"${escapeChar(val)}"`
        : `"${val.replace(/[\u0000-\u001F\\"]/g, escapeChar)}"`;
    } else if (Array.isArray(val)) {
      return `[${val.map(show).join(", ")}]`;
    } else if (typeof val === "object" && val !== null && typeof val.toString !== "function") {
      // treatment for objects without `toString` method, such as `Object.create(null)`
      return Object.prototype.toString.call(val);
    } else {
      return String(val);
    }
  }

  /**
   * unconsString: (str: string, unicode: boolean)
   *   => { empty: true } \/ { empty: false, head: string, tail: string }
   *
   * Returns a pair of the first character (head) and the rest (tail) of the given string.
   * If `unicode` is set to `true`, a character will be a Unicode code point; otherwise it will be a
   * UTF-16 code unit. This is similar to the `unicode` flag of `RegExp`.
   */
  function unconsString(str, unicode) {
    const len = str.length;
    if (unicode) {
      if (len === 0) {
        return { empty: true };
      } else if (len === 1) {
        return { empty: false, head: str[0], tail: str.substr(1) };
      } else {
        // avoid using `String.fromCodePoint` and `String#codePointAt` because of poor performance
        const first = str.charCodeAt(0);
        if (first < 0xD800 || 0xDBFF < first) {
          return { empty: false, head: str[0], tail: str.substr(1) };
        }
        const second = str.charCodeAt(1);
        if (second < 0xDC00 || 0xDFFF < second) {
          return { empty: false, head: str[0], tail: str.substr(1) };
        }
        return { empty: false, head: String.fromCharCode(first, second), tail: str.substr(2) };
      }
    } else {
      return len === 0
        ? { empty: true }
        : { empty: false, head: str[0], tail: str.substr(1) };
    }
  }

  return Object.freeze({
    _internal: {
      escapeChar,
    },
    show,
    unconsString,
  });
};
