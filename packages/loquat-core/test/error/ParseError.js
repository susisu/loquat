/*
 * loquat-core test / error.ParseError
 * copyright (c) 2016 Susisu
 */

"use strict";

describe(".ParseError", () => {
    require("./ParseError/constructor.js");
    require("./ParseError/unknown.js");
    require("./ParseError/equal.js");
    require("./ParseError/merge.js");
    require("./ParseError/toString.js");
    require("./ParseError/isUnknown.js");
    require("./ParseError/setPosition.js");
    require("./ParseError/addMessages.js");
    require("./ParseError/setSpecificTypeMessages.js");
});
