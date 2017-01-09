/*
 * loquat-core / stream.js
 */

/**
 * @module stream
 */

"use strict";

module.exports = _utils => {
    function end() {
        return Object.freeze({
            uncons,
            ArrayStream
        });
    }

    const unconsString = _utils.unconsString;

    /**
     * @interface IStream
     * @description The `IStream` interface abstracts stream objects.
     * User-defined streams must implement this interface.
     * @static
     */
    /**
     * @method module:stream.IStream#uncons
     * @description Reads the stream.
     * It must return an object that satisfies these requirements:
     * <table>
     * <tr><th>Property</th><th>Type</th><th>Description</th></tr>
     * <tr><td>`empty`</td><td>boolean</td><td>Indicates the stream is empty or not.
     * If not empty, the object must have `head` and `tail` properties.</td></tr>
     * <tr><td>`head`</td><td></td><td>The head of the stream.</td></tr>
     * <tr><td>`tail`</td><td>{@link module:stream.IStream}</td><td>The tail (rest) of the stream.</td></tr>
     * </table>
     * @param {boolean} unicode If `true` specified, string-like stream should enable unicode features.
     * @returns {Object} An object that have properties describes above.
     */

    /**
     * @function module:stream.uncons
     * @description Reads input.
     * A result object should contain the following properties.
     * <table>
     * <tr><th>Property</th><th>Type</th><th>Description</th></tr>
     * <tr><td>`empty`</td><td>boolean</td><td>Indicates the input is empty or not.
     * If not empty, the object have `head` and `tail` properties.</td></tr>
     * <tr><td>`head`</td><td></td><td>The head of the input.</td></tr>
     * <tr><td>`tail`</td><td>string | Array | {@link module:stream.IStream}</td>
     * <td>The tail (rest) of the input.</td></tr>
     * </table>
     * @static
     * @param {(string|Array|module:stream.IStream)} input A string, an array,
     * or an {@link module:stream.IStream} object.
     * @param {boolean} unicode For string input, if `true` specified characters are unconsed in code point unit.
     * For string-like stream, if `true` specified it would enable unicode features
     * through {@link module:stream.IStream#uncons} method.
     * @returns {Object} An object that have properties describes above.
     * @throws {TypeError} `input` is not a string nor an array,
     * or object does not implement the {@link module:stream.IStream} interface.
     */
    function uncons(input, unicode) {
        if (typeof input === "string") {
            return unconsString(input, unicode);
        }
        else if (Array.isArray(input)) {
            return input.length === 0
                ? { empty: true }
                : { empty: false, head: input[0], tail: input.slice(1) };
        }
        else if (typeof input === "object" && input !== null) {
            if (typeof input.uncons === "function") {
                return input.uncons(unicode);
            }
            else {
                throw new TypeError("not a stream");
            }
        }
        else {
            throw new TypeError("not a stream");
        }
    }

    /**
     * The `ArrayStream` class provide more efficient stream of arrays.
     * @static
     * @implements {module:stream.IStream}
     */
    class ArrayStream {
        /**
         * Creates a new `ArrayStream` instance.
         * @param {Array} arr An array object.
         * @param {number} index Current index.
         */
        constructor(arr, index) {
            this._arr   = arr;
            this._index = index;
        }

        /**
         * @readonly
         * @type {Array}
         */
        get arr() {
            return this._arr;
        }

        /**
         * @readonly
         * @type {number}
         */
        get index() {
            return this._index;
        }

        /**
         * Returns a pair of the element at the current index and rest of the stream.
         * @param {boolean} unicode Will not be considered.
         * @returns {Object}
         */
        uncons() {
            return this._index >= this._arr.length
                ? { empty: true }
                : {
                    empty: false,
                    head : this._arr[this._index],
                    tail : new ArrayStream(this._arr, this._index + 1)
                };
        }
    }

    return end();
};
