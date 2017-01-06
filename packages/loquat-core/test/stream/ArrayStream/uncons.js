/*
 * loquat-core test / stream.ArrayStream#uncons()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const ArrayStream = _stream.ArrayStream;

describe("#uncons(unicode)", () => {
    it("should return an object describing empty if the current index of the stream is out of the array length", () => {
        // empty
        {
            const stream = new ArrayStream([], 0);
            const unconsed = stream.uncons(false);
            expect(unconsed).to.deep.equal({ empty: true });
        }
        {
            const stream = new ArrayStream([], 0);
            const unconsed = stream.uncons(true);
            expect(unconsed).to.deep.equal({ empty: true });
        }
        // non-empty
        {
            const stream = new ArrayStream(["abc", "def", "ghi"], 3);
            const unconsed = stream.uncons(false);
            expect(unconsed).to.deep.equal({ empty: true });
        }
        {
            const stream = new ArrayStream(["abc", "def", "ghi"], 3);
            const unconsed = stream.uncons(true);
            expect(unconsed).to.deep.equal({ empty: true });
        }
        {
            const stream = new ArrayStream(["abc", "def", "ghi"], 4);
            const unconsed = stream.uncons(false);
            expect(unconsed).to.deep.equal({ empty: true });
        }
        {
            const stream = new ArrayStream(["abc", "def", "ghi"], 4);
            const unconsed = stream.uncons(true);
            expect(unconsed).to.deep.equal({ empty: true });
        }
    });

    it("should return a non-empty object with the element at the current index and rest of the stream", () => {
        {
            const stream = new ArrayStream(["abc", "def", "ghi"], 0);
            const unconsed = stream.uncons(false);
            expect(unconsed.empty).to.be.false;
            expect(unconsed.head).to.equal("abc");
            expect(unconsed.tail).to.be.an.instanceOf(ArrayStream);
            expect(unconsed.tail.arr).to.deep.equal(["abc", "def", "ghi"]);
            expect(unconsed.tail.index).to.equal(1);
        }
        {
            const stream = new ArrayStream(["abc", "def", "ghi"], 0);
            const unconsed = stream.uncons(true);
            expect(unconsed.empty).to.be.false;
            expect(unconsed.head).to.equal("abc");
            expect(unconsed.tail).to.be.an.instanceOf(ArrayStream);
            expect(unconsed.tail.arr).to.deep.equal(["abc", "def", "ghi"]);
            expect(unconsed.tail.index).to.equal(1);
        }
        {
            const stream = new ArrayStream(["abc", "def", "ghi"], 1);
            const unconsed = stream.uncons(false);
            expect(unconsed.empty).to.be.false;
            expect(unconsed.head).to.equal("def");
            expect(unconsed.tail).to.be.an.instanceOf(ArrayStream);
            expect(unconsed.tail.arr).to.deep.equal(["abc", "def", "ghi"]);
            expect(unconsed.tail.index).to.equal(2);
        }
        {
            const stream = new ArrayStream(["abc", "def", "ghi"], 1);
            const unconsed = stream.uncons(true);
            expect(unconsed.empty).to.be.false;
            expect(unconsed.head).to.equal("def");
            expect(unconsed.tail).to.be.an.instanceOf(ArrayStream);
            expect(unconsed.tail.arr).to.deep.equal(["abc", "def", "ghi"]);
            expect(unconsed.tail.index).to.equal(2);
        }
        {
            const stream = new ArrayStream(["abc", "def", "ghi"], 2);
            const unconsed = stream.uncons(false);
            expect(unconsed.empty).to.be.false;
            expect(unconsed.head).to.equal("ghi");
            expect(unconsed.tail).to.be.an.instanceOf(ArrayStream);
            expect(unconsed.tail.arr).to.deep.equal(["abc", "def", "ghi"]);
            expect(unconsed.tail.index).to.equal(3);
        }
        {
            const stream = new ArrayStream(["abc", "def", "ghi"], 2);
            const unconsed = stream.uncons(true);
            expect(unconsed.empty).to.be.false;
            expect(unconsed.head).to.equal("ghi");
            expect(unconsed.tail).to.be.an.instanceOf(ArrayStream);
            expect(unconsed.tail.arr).to.deep.equal(["abc", "def", "ghi"]);
            expect(unconsed.tail.index).to.equal(3);
        }
    });
});
