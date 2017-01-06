/*
 * loquat-core test / stream.uncons()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const uncons = _stream.uncons;

describe(".uncons(input, unicode)", () => {
    it("should return an object describing empty input if `input' is an empty string", () => {
        expect(uncons("", false)).to.deep.equal({ empty: true });
        expect(uncons("", true)).to.deep.equal({ empty: true });
    });

    it("should return an object containing head and tail if `input' is an non-empty string", () => {
        expect(uncons("foobar", false)).to.deep.equal({ empty: false, head: "f", tail: "oobar" });
        expect(uncons("foobar", true)).to.deep.equal({ empty: false, head: "f", tail: "oobar" });

        expect(uncons("\uD83C\uDF63cat", false)).to.deep.equal({ empty: false, head: "\uD83C", tail: "\uDF63cat" });
        expect(uncons("\uD83C\uDF63cat", true)).to.deep.equal({ empty: false, head: "\uD83C\uDF63", tail: "cat" });
    });

    it("should return an object describing empty input if `input' is an empty array", () => {
        expect(uncons([], false)).to.deep.equal({ empty: true });
        expect(uncons([], true)).to.deep.equal({ empty: true });
    });

    it("should return an object containing head and tail if `input' is an non-empty array", () => {
        expect(uncons(["foo", "bar", "baz"], false)).to.deep.equal({
            empty: false,
            head : "foo",
            tail : ["bar", "baz"]
        });
        expect(uncons(["foo", "bar", "baz"], true)).to.deep.equal({
            empty: false,
            head : "foo",
            tail : ["bar", "baz"]
        });
    });

    it("should return an object describing empty input if `input' is an empty stream object", () => {
        {
            const stream = {
                uncons: unicode => {
                    expect(unicode).to.be.false;
                    return { empty: true };
                }
            };
            expect(uncons(stream, false)).to.deep.equal({ empty: true });
        }
        {
            const stream = {
                uncons: unicode => {
                    expect(unicode).to.be.true;
                    return { empty: true };
                }
            };
            expect(uncons(stream, true)).to.deep.equal({ empty: true });
        }
    });

    it("should return an object containing head and tail if `input' is an non-empty stream object", () => {
        {
            const tail = {
                uncons: unicode => {
                    expect(unicode).to.be.false;
                    return { empty: true };
                }
            };
            const stream = {
                uncons: unicode => {
                    expect(unicode).to.be.false;
                    return {
                        empty: false,
                        head : "nyancat",
                        tail : tail
                    };
                }
            };
            expect(uncons(stream, false)).to.deep.equal({ empty: false, head: "nyancat", tail: tail });
        }
        {
            const tail = {
                uncons: unicode => {
                    expect(unicode).to.be.true;
                    return { empty: true };
                }
            };
            const stream = {
                uncons: unicode => {
                    expect(unicode).to.be.true;
                    return {
                        empty: false,
                        head : "nyancat",
                        tail : tail
                    };
                }
            };
            expect(uncons(stream, true)).to.deep.equal({ empty: false, head: "nyancat", tail: tail });
        }
    });

    it("should throw a `TypeError' if `input' does not implement `IStream' interface", () => {
        expect(() => { uncons({}, false); }).to.throw(TypeError);
        expect(() => { uncons({}, true); }).to.throw(TypeError);
    });

    it("should throw a `TypeError' if `input' is not a string, an array, nor an object", () => {
        const values = [
            null,
            undefined,
            496,
            true,
            () => {}
        ];
        for (const value of values) {
            expect(() => { uncons(value, false); }).to.throw(TypeError);
            expect(() => { uncons(value, true); }).to.throw(TypeError);
        }
    });
});
