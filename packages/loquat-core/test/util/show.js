/*
 * loquat-core test / util.show()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { show } = require("../../lib/util.js");

describe(".show(value)", () => {
    it("should return escaped and double-quoted (\"...\") string if `value' is a string", () => {
        let str = "0\\9\"A\bZ\ta\nz\r'\f`\vあ安🍣";
        expect(show(str)).to.equal("\"0\\\\9\\\"A\\bZ\\ta\\nz\\r'\\f`\\vあ安🍣\"");
    });

    it("should stringify each element by `show()' and return joined string separated by commas (,)"
        + " and wrapped by braces ([...]) if `value' is an array", () => {
        let arr = [
            null,
            undefined,
            "0\\9\"A\bZ\ta\nz\r'\f`\vあ安🍣",
            3.14,
            true,
            { toString: () => "foobar" },
            Object.create(null),
            [1, "nyancat", false]
        ];
        expect(show(arr)).to.equal(
            "["
            + "null, undefined, \"0\\\\9\\\"A\\bZ\\ta\\nz\\r'\\f`\\vあ安🍣\", "
            + "3.14, true, foobar, "
            + Object.prototype.toString.call(Object.create(null)) + ", "
            + "[1, \"nyancat\", false]"
            + "]"
        );
    });

    it("should call `Object.prototype.toString()' with `value' as the `this' argument"
        + " if `value' is an object and `value.toString' is not a function", () => {
        let obj = Object.create(null);
        expect(show(obj)).to.equal(Object.prototype.toString.call(obj));
    });

    it("should call `String(value)' otherwise", () => {
        expect(show(null)).to.equal("null");
        expect(show(undefined)).to.equal("undefined");
        expect(show(3.14)).to.equal("3.14");
        expect(show(true)).to.equal("true");
        expect(show({ toString: () => "foobar" })).to.equal("foobar");
    });
});
