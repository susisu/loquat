/*
 * loquat-core test / utils.show()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const show = _utils.show;

describe(".show(value)", () => {
    it("should return escaped and double-quoted (\"...\") string if `value' is a string", () => {
        // empty
        {
            expect(show("")).to.equal("\"\"");
        }
        // single character
        {
            expect(show("0")).to.equal("\"0\"");
            expect(show("A")).to.equal("\"A\"");
            expect(show("a")).to.equal("\"a\"");
            expect(show("\\")).to.equal("\"\\\\\"");
            expect(show("\"")).to.equal("\"\\\"\"");
            expect(show("\b")).to.equal("\"\\b\"");
            expect(show("\t")).to.equal("\"\\t\"");
            expect(show("\n")).to.equal("\"\\n\"");
            expect(show("\r")).to.equal("\"\\r\"");
            expect(show("\f")).to.equal("\"\\f\"");
            expect(show("\v")).to.equal("\"\\v\"");
            expect(show("\u3042")).to.equal("\"\u3042\"");
            expect(show("\u5b89")).to.equal("\"\u5b89\"");
            expect(show("\uD83C\uDF63")).to.equal("\"\uD83C\uDF63\"");
        }
        // multiple characters
        {
            let str = "0\\9\"A\bZ\ta\nz\r'\f`\v\u3042\u5b89\uD83C\uDF63";
            expect(show(str)).to.equal("\"0\\\\9\\\"A\\bZ\\ta\\nz\\r'\\f`\\v\u3042\u5b89\uD83C\uDF63\"");
        }
    });

    it("should stringify each element by `show()' and return joined string separated by commas (,)"
        + " and wrapped by braces ([...]) if `value' is an array", () => {
        let arr = [
            null,
            undefined,
            "0\\9\"A\bZ\ta\nz\r'\f`\v\u3042\u5b89\uD83C\uDF63",
            3.14,
            true,
            { toString: () => "foobar" },
            Object.create(null),
            [1, "nyancat", false]
        ];
        expect(show(arr)).to.equal(
            "["
            + "null, undefined, \"0\\\\9\\\"A\\bZ\\ta\\nz\\r'\\f`\\v\u3042\u5b89\uD83C\uDF63\", "
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
