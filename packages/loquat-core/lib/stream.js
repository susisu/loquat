"use strict";

module.exports = ({ _utils }) => {
  const { unconsString } = _utils;

  /**
   * type UnconsResult[T, S] = { empty: true } \/ { empty: false, head: T, tail: S }
   */

  /**
   * trait Stream[S <: Stream[S]] { self: S =>
   *   type Token
   *   def uncons(config: Config): UnconsResult[Token, S]
   * }
   *
   * `Stream[S]` abstracts input for parsers.
   */

  /**
   * uncons: [S <: Stream[S]](input: S, config: Config) => UnconsResult[input.Token, S]
   *
   * Returns a pair of the first token (head) and the rest (tail) of the input stream.
   * The function also accepts `string` and `Array[T]` for all `T`. You can imagine that there are
   * implicit conversions between `string` and `Stream[S]`:
   *
   * ```
   * class ImplicitStringStream(str: String) extends Stream[ImplicitStringStream] {
   *   type Token = string
   *   def uncons(config: Config): UnconsResult[Token, ImplicitStringStream]
   * }
   * ```
   *
   * and that between `Array[T]` and `Stream[S]`:
   *
   * ```
   * class ImplicitArrayStream[T](arr: Array[T]) extends Stream[ImplicitArrayStream[T]] {
   *   type Token = T
   *   def uncons(config: Config): UnconsResult[Token, ImplicitArrayStream[T]]
   * }
   * ```
   *
   * Using `Array[T]` as input is not recommended because of poor performance. Consider using
   * `ArrayStream[T]` instead.
   *
   */
  function uncons(input, config) {
    if (typeof input === "string") {
      return unconsString(input, config.unicode);
    } else if (Array.isArray(input)) {
      return input.length === 0
        ? { empty: true }
        : { empty: false, head: input[0], tail: input.slice(1) };
    } else if (typeof input === "object" && input !== null) {
      if (typeof input.uncons === "function") {
        return input.uncons(config);
      } else {
        throw new TypeError("input is not a stream");
      }
    } else {
      throw new TypeError("input is not a stream");
    }
  }

  /**
   * class ArrayStream[T](arr: Array[T], index: int) extends Stream[ArrayStream[T]] {
   *   type Token = T
   * }
   *
   * `ArrayStream[T]` provides an efficient `Stream[S]` implementation for arrays.
   */
  class ArrayStream {
    constructor(arr, index) {
      this._arr   = arr;
      this._index = index;
    }

    get arr() {
      return this._arr;
    }

    get index() {
      return this._index;
    }

    /**
     * ArrayStream[T]#uncons(config: Config): UnconsResult[T, ArrayStream[T]]
     */
    uncons(config) {
      return this._index >= this._arr.length
        ? { empty: true }
        : {
          empty: false,
          head : this._arr[this._index],
          tail : new ArrayStream(this._arr, this._index + 1),
        };
    }
  }

  return Object.freeze({
    uncons,
    ArrayStream,
  });
};
