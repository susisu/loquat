/*
 * loquat-core test / error._internal.cleanMessageStrings()
 * copyright (c) 2016 Susisu
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const cleanMessageStrings = _error._internal.cleanMessageStrings;

describe(".cleanMessageStrings(msgStrs)", () => {
    it("should remove both duplicate messages and empty messages", () => {
        {
            expect(cleanMessageStrings([])).to.deep.equal([]);
        }
        {
            let msgStrs = ["", ""];
            expect(cleanMessageStrings(msgStrs)).to.deep.equal([]);
        }
        {
            let msgStrs = [
                "",
                "foo",
                "bar",
                "",
                "foo",
                "baz",
                "foo",
                "bar"
            ];
            expect(cleanMessageStrings(msgStrs)).to.deep.equal([
                "foo",
                "bar",
                "baz"
            ]);
        }
    });
});
