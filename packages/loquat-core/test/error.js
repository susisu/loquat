/*
 * loquat-core test / error
 * copyright (c) 2016 Susisu
 */

"use strict";

describe("error", () => {
    require("./error/ErrorMessage.js");
    require("./error/AbstractParseError.js");
    require("./error/ParseError.js");
    require("./error/LazyParseError.js");
    require("./error/_internal.js");
});
