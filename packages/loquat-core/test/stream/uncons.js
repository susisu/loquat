/*
 * loquat-core test / stream.uncons()
 * copyright (c) 2016 Susisu
 */

"use strict";

const { expect } = require("chai");

const { uncons } = require("stream.js");

describe(".uncons(stream)", () => {
    it("should return an object describing empty stream if `stream' is an empty string", () => {
        expect(uncons("")).to.deep.equal({ empty: true });
    });

    it("should return an object containing head and tail if `stream' is an non-empty string", () => {
        expect(uncons("foobar")).to.deep.equal({ empty: false, head: "f", tail: "oobar" });
    });

    it("should return an object describing empty stream if `stream' is an empty array", () => {
        expect(uncons([])).to.deep.equal({ empty: true });
    });

    it("should return an object containing head and tail if `stream' is an non-empty array", () => {
        expect(uncons(["foo", "bar", "baz"])).to.deep.equal({
            empty: false,
            head : "foo",
            tail : ["bar", "baz"]
        });
    });

    it("should return an object describing empty stream if `stream' is an empty stream object", () => {
        let stream = {
            uncons: () => ({ empty: true })
        };
        expect(uncons(stream)).to.deep.equal({ empty: true });
    });

    it("should return an object containing head and tail if `stream' is an non-empty stream object", () => {
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

    it("should throw a `TypeError' if `stream' does not implement `IStream' interface", () => {
        expect(() => { uncons({}); }).to.throw(TypeError);
    });

    it("should throw a `TypeError' if `stream' is not a string, an array, nor an object", () => {
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
