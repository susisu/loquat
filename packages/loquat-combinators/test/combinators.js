/*
 * loquat-combinators test / combinators
 * copyright (c) 2016 Susisu
 */

"use strict";

describe("combinators", () => {
    require("./combinators/choice.js");
    require("./combinators/option.js");
    require("./combinators/optionMaybe.js");
    require("./combinators/optional.js");
    require("./combinators/between.js");
    require("./combinators/many1.js");
    require("./combinators/skipMany1.js");
    require("./combinators/sepBy.js");
    require("./combinators/sepBy1.js");
    require("./combinators/sepEndBy.js");
    require("./combinators/sepEndBy1.js");
    require("./combinators/endBy.js");
    require("./combinators/endBy1.js");
    require("./combinators/count.js");
    require("./combinators/chainl.js");
    require("./combinators/chainl1.js");
    require("./combinators/chainr.js");
    require("./combinators/chainr1.js");
    require("./combinators/anyToken.js");
    require("./combinators/notFollowedBy.js");
    require("./combinators/eof.js");
});
