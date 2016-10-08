/*
 * loquat-combinators
 * copyright (c) 2016 Susisu
 */

"use strict";

module.exports = (core, sugar) => {
    let _combinators = require("./lib/combinators.js")(core);
    const choice        = _combinators.choice;
    const option        = _combinators.option;
    const optionMaybe   = _combinators.optionMaybe;
    const optional      = _combinators.optional;
    const between       = _combinators.between;
    const many1         = _combinators.many1;
    const skipMany1     = _combinators.skipMany1;
    const sepBy         = _combinators.sepBy;
    const sepBy1        = _combinators.sepBy1;
    const sepEndBy      = _combinators.sepEndBy;
    const sepEndBy1     = _combinators.sepEndBy1;
    const endBy         = _combinators.endBy;
    const endBy1        = _combinators.endBy1;
    const count         = _combinators.count;
    const chainl        = _combinators.chainl;
    const chainl1       = _combinators.chainl1;
    const chainr        = _combinators.chainr;
    const chainr1       = _combinators.chainr1;
    const anyToken      = _combinators.anyToken;
    const notFollowedBy = _combinators.notFollowedBy;
    const eof           = _combinators.eof;
    const manyTill      = _combinators.manyTill;

    return Object.freeze({
        choice,
        option,
        optionMaybe,
        optional,
        between,
        many1,
        skipMany1,
        sepBy,
        sepBy1,
        sepEndBy,
        sepEndBy1,
        endBy,
        endBy1,
        count,
        chainl,
        chainl1,
        chainr,
        chainr1,
        anyToken,
        notFollowedBy,
        eof,
        manyTill
    });
};
