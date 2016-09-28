/*
 * loquat-core test / stream.uncons()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { uncons } = require("stream.js");

describe(".uncons(input)", () => {
    it("should return an object describing empty input if `input' is an empty string", () => {
        expect(uncons("")).to.deep.equal({ empty: true });
    });

    it("should return an object containing head and tail if `input' is an non-empty string", () => {
        expect(uncons("foobar")).to.deep.equal({ empty: false, head: "f", tail: "oobar" });
    });

    it("should return an object describing empty input if `input' is an empty array", () => {
        expect(uncons([])).to.deep.equal({ empty: true });
    });

    it("should return an object containing head and tail if `input' is an non-empty array", () => {
        expect(uncons(["foo", "bar", "baz"])).to.deep.equal({
            empty: false,
            head : "foo",
            tail : ["bar", "baz"]
        });
    });

    it("should return an object describing empty input if `input' is an empty stream object", () => {
        let stream = {
            uncons: () => ({ empty: true })
        };
        expect(uncons(stream)).to.deep.equal({ empty: true });
    });

    it("should return an object containing head and tail if `input' is an non-empty stream object", () => {
        let tail = {
            uncons: () => ({ empty: true })
        };
        let stream = {
            uncons: () => ({
                empty: false,
                head : "nyancat",
                tail : tail
            })
        };
        expect(uncons(stream)).to.deep.equal({ empty: false, head: "nyancat", tail: tail });
    });

    it("should throw a `TypeError' if `input' does not implement `IStream' interface", () => {
        expect(() => { uncons({}); }).to.throw(TypeError);
    });

    it("should throw a `TypeError' if `input' is not a string, an array, nor an object", () => {
        let values = [
            null,
            undefined,
            496,
            true,
            () => {}
        ];
        for (let value of values) {
            expect(() => { uncons(value); }).to.throw(TypeError);
        }
    });
});
