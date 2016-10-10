/*
 * loquat-core / stream.js
 * copyright (c) 2016 Susisu
 */

/**
 * @module stream
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        uncons
    });
}

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
 * @returns {Object} An object that have properties describes above.
 */

/**
 * Reads the input.
 * A returned object has the following properties.
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
 * @param {boolean} unicode For string input, if `true` specified, the input is unconsed in units of code points.
 * @returns {Object} An object that have properties describes above.
 * @throws {TypeError} `input` is not a string nor an array,
 * or object does not implement the {@link module:stream.IStream} interface.
 */
function uncons(input, unicode) {
    if (typeof input === "string") {
        if (unicode) {
            const cp = input.codePointAt(0);
            if (cp === undefined) {
                return { empty: true };
            }
            else {
                const char = String.fromCodePoint(cp);
                return { empty: false, head: char, tail: input.substr(char.length) };
            }
        }
        else {
            return input === ""
                ? { empty: true }
                : { empty: false, head: input[0], tail: input.substr(1) };
        }
    }
    else if (Array.isArray(input)) {
        return input.length === 0
            ? { empty: true }
            : { empty: false, head: input[0], tail: input.slice(1) };
    }
    else if (typeof input === "object" && input !== null) {
        if (typeof input.uncons === "function") {
            return input.uncons();
        }
        else {
            throw new TypeError("not a stream");
        }
    }
    else {
        throw new TypeError("not a stream");
    }
}

end();
