"use strict";

module.exports = (_core, { _prim, _char, _combinators }) => {
  const { show, unconsString, lazy, isParser } = _core;
  const {
    map,
    pure,
    bind,
    then,
    tailRecM,
    ftailRecM,
    mplus,
    label,
    unexpected,
    tryParse,
    skipMany,
    getConfig,
  } = _prim;
  const {
    string,
    satisfy,
    oneOf,
    noneOf,
    char,
    space,
    upper,
    digit,
    octDigit,
    hexDigit,
    manyChars,
    manyChars1,
  } = _char;
  const {
    choice,
    option,
    between,
    many1,
    skipMany1,
    sepBy,
    sepBy1,
    notFollowedBy,
  } = _combinators;

  /** constant: [A, B]A => B => A */
  function constant(x) {
    return _ => x;
  }

  /*
   * white spaces
   */

  /** spaceChars: Set[char] */
  const spaceChars = new Set(" \f\n\r\t\v");
  /** simpleSpace: [S <: CharacterStream[S], U]Parser[S, U, undefined] */
  const simpleSpace = skipMany1(satisfy((char, _) => spaceChars.has(char)));

  /**
   * oneLineComment: [S <: CharacterStream[S], U](commentLine: string) => Parser[S, U, undefined]
   */
  function oneLineComment(commentLine) {
    return then(
      tryParse(string(commentLine)),
      then(
        skipMany(satisfy((char, _) => char !== "\n")),
        pure(undefined)
      )
    );
  }

  /**
   * multiLineComment: [S <: CharacterStream[S], U](
   *   commentStart: string,
   *   commentEnd: string,
   *   nestedComments: boolean
   * ) => Parser[S, U, undefined]
   */
  function multiLineComment(commentStart, commentEnd, nestedComments) {
    /** comment: Parser[S, U, undefined] */
    const comment = lazy(() =>
      then(
        tryParse(string(commentStart)),
        inComment // eslint-disable-line no-use-before-define
      )
    );
    const commentStartEnd = commentStart + commentEnd;
    /** inCommentMulti: Parser[S, U, undefined] */
    const inCommentMulti = tailRecM(
      undefined,
      constant(label(
        mplus(
          then(
            tryParse(string(commentEnd)),
            pure({ done: true, value: undefined })
          ),
          mplus(
            map(comment, _ => ({ done: false, value: undefined })),
            mplus(
              map(
                skipMany1(noneOf(commentStartEnd)),
                _ => ({ done: false, value: undefined })
              ),
              map(
                oneOf(commentStartEnd),
                _ => ({ done: false, value: undefined })
              )
            )
          )
        ),
        "end of comment"
      ))
    );
    /** inCommentSingle: Parser[S, U, undefined] */
    const inCommentSingle = tailRecM(
      undefined,
      constant(label(
        mplus(
          then(
            tryParse(string(commentEnd)),
            pure({ done: true, value: undefined })
          ),
          mplus(
            map(
              skipMany1(noneOf(commentStartEnd)),
              _ => ({ done: false, value: undefined })
            ),
            map(
              oneOf(commentStartEnd),
              _ => ({ done: false, value: undefined })
            )
          )
        ),
        "end of comment"
      ))
    );
    /** inComment: Parser[S, U, undefined] */
    const inComment = nestedComments ? inCommentMulti : inCommentSingle;
    return comment;
  }

  /*
   * number literals
   */
  /** number: [S, U](base: int, baseDigit: Parser[S, U, char]) => Parser[S, U, int] */
  function number(base, baseDigit) {
    return map(manyChars1(baseDigit), digits => parseInt(digits, base));
  }
  /** decimal: [S <: CharacterStream[S], U]Parser[S, U, int] */
  const decimal = number(10, digit);
  /** hexadecimal: [S <: CharacterStream[S], U]Parser[S, U, int] */
  const hexadecimal = then(oneOf("Xx"), number(16, hexDigit));
  /** octal: [S <: CharacterStream[S], U]Parser[S, U, int] */
  const octal = then(oneOf("Oo"), number(8, octDigit));

  // natural
  /** zeroNumber: [S <: CharacterStream[S], U]Parser[S, U, int] */
  const zeroNumber = label(
    then(
      char("0"),
      mplus(hexadecimal, mplus(octal, mplus(decimal, pure(0))))
    ),
    ""
  );
  /** nat: [S <: CharacterStream[S], U]Parser[S, U, int] */
  const nat = mplus(zeroNumber, decimal);

  // integer
  /** [S <: CharacterStream[S], U]Parser[S, U, int => int] */
  const sign = mplus(
    then(char("-"), pure(x => -x)),
    mplus(
      then(char("+"), pure(x => x)),
      pure(x => x)
    )
  );

  // float
  /** signChar: [S <: CharacterStream[S], U]Parser[S, U, string] */
  const signChar = mplus(char("-"), mplus(char("+"), pure("")));
  /** fraction: [S <: CharacterStream[S], U]Parser[S, U, string] */
  const fraction = label(
    then(
      char("."),
      map(label(manyChars1(digit), "fraction"), digits => "." + digits)
    ),
    "fraction"
  );
  /** exponent: [S <: CharacterStream[S], U]Parser[S, U, string] */
  const exponent = label(
    then(
      oneOf("Ee"),
      bind(signChar, s =>
        map(label(decimal, "exponent"), e => "e" + s + e)
      )
    ),
    "exponent"
  );
  /** fractExponent: [S <: CharacterStream[S], U](nat: string) => Parser[S, U, float] */
  function fractExponent(nat) {
    return mplus(
      bind(fraction, fract =>
        map(option("", exponent), expo => parseFloat(nat + fract + expo))
      ),
      map(exponent, expo => parseFloat(nat + expo))
    );
  }
  /** floating: [S <: CharacterStream[S], U]Parser[S, U, float] */
  const floating = bind(manyChars1(digit), fractExponent);

  // natural or float
  /**
   * type NaturalOrFloat =
   *      { type: "natural", value: int }
   *   \/ { type: "float", value: float }
   */

  /** fractFloat: [S <: CharacterStream[S], U](nat: string) => Parser[S, U, NaturalOrFloat] */
  function fractFloat(nat) {
    return bind(fractExponent(nat), f =>
      pure({ type: "float", value: f })
    );
  }
  /** decimalFloat: [S <: CharacterStream[S], U]Parser[S, U, NaturalOrFloat] */
  const decimalFloat = bind(manyChars1(digit), nat =>
    option({ type: "natural", value: parseInt(nat, 10) }, fractFloat(nat))
  );
  /** zeroNumFloat: [S <: CharacterStream[S], U] Parser[S, U, NaturalOrFloat] */
  const zeroNumFloat = mplus(
    map(mplus(hexadecimal, octal), n => ({ type: "natural", value: n })),
    mplus(
      decimalFloat,
      mplus(
        fractFloat("0"),
        pure({ type: "natural", value: 0 })
      )
    )
  );
  /** natFloat: [S <: CharacterStream[S], U]Parser[S, U, NaturalOrFloat] */
  const natFloat = mplus(
    then(char("0"), zeroNumFloat),
    decimalFloat
  );

  /*
   * character / string literals
   */
  const escMap = {
    "a" : "\u0007",
    "b" : "\b",
    "f" : "\f",
    "n" : "\n",
    "r" : "\r",
    "t" : "\t",
    "v" : "\v",
    "\\": "\\",
    "\"": "\"",
    "'" : "'",
  };
  const asciiMap = {
    "BS" : "\u0008",
    "HT" : "\u0009",
    "LF" : "\u000a",
    "VT" : "\u000b",
    "FF" : "\u000c",
    "CR" : "\u000d",
    "SO" : "\u000e",
    "SI" : "\u000f",
    "EM" : "\u0019",
    "FS" : "\u001c",
    "GS" : "\u001d",
    "RS" : "\u001e",
    "US" : "\u001f",
    "SP" : "\u0020",
    "NUL": "\u0000",
    "SOH": "\u0001",
    "STX": "\u0002",
    "ETX": "\u0003",
    "EOT": "\u0004",
    "ENQ": "\u0005",
    "ACK": "\u0006",
    "BEL": "\u0007",
    "DLE": "\u0010",
    "DC1": "\u0011",
    "DC2": "\u0012",
    "DC3": "\u0013",
    "DC4": "\u0014",
    "NAK": "\u0015",
    "SYN": "\u0016",
    "ETB": "\u0017",
    "CAN": "\u0018",
    "SUB": "\u001a",
    "ESC": "\u001b",
    "DEL": "\u007f",
  };
  /** charEsc: [S <: CharacterStream[S], U]Parser[S, U, char] */
  const charEsc = choice(
    Object.keys(escMap).sort().map(c =>
      then(char(c), pure(escMap[c]))
    )
  );
  /** charNum: [S <: CharacterStream[S], U]Parser[S, U, char] */
  const charNum = bind(
    mplus(
      decimal,
      mplus(
        then(char("o"), number(8, octDigit)),
        then(char("x"), number(16, hexDigit))
      )
    ),
    code => pure(String.fromCharCode(code))
  );
  /** charAscii: [S <: CharacterStream[S], U]Parser[S, U, char] */
  const charAscii = choice(
    Object.keys(asciiMap).sort().map(asc =>
      tryParse(
        then(string(asc), pure(asciiMap[asc]))
      )
    )
  );
  /** charControl: [S <: CharacterStream[S], U]Parser[S, U, char] */
  const charControl = then(
    char("^"),
    map(upper, code => String.fromCharCode(code.charCodeAt(0) - "A".charCodeAt(0) + 1))
  );
  /** escapeCode: [S <: CharacterStream[S], U]Parser[S, U, char] */
  const escapeCode = label(
    mplus(charEsc, mplus(charNum, mplus(charAscii, charControl))),
    "escape code"
  );
  /** charLetter: [S <: CharacterStream[S], U]Parser[S, U, char] */
  const charLetter = satisfy((c, _) => c !== "'" && c !== "\\" && c > "\u001a");
  /** charEscape: [S <: CharacterStream[S], U]Parser[S, U, char] */
  const charEscape = then(char("\\"), escapeCode);
  /** characterChar: [S <: CharacterStream[S], U]Parser[S, U, char] */
  const characterChar = label(
    mplus(charLetter, charEscape),
    "literal character"
  );

  /** stringLetter: [S <: CharacterStream[S], U]Parser[S, U, char] */
  const stringLetter = satisfy((c, _) => c !== "\"" && c !== "\\" && c > "\u001a");
  /** escapeGap: [S <: CharacterStream[S], U]Parser[S, U, char] */
  const escapeGap = then(
    many1(space),
    label(char("\\"), "end of string gap")
  );
  /** escapeEmpty: [S <: CharacterStream[S], U]Parser[S, U, char] */
  const escapeEmpty = char("&");
  /** stringEscape: [S <: CharacterStream[S], U]Parser[S, U, char] */
  const stringEscape = then(
    char("\\"),
    mplus(
      then(escapeGap, pure("")),
      mplus(
        then(escapeEmpty, pure("")),
        escapeCode
      )
    )
  );
  /** stringChar: [S <: CharacterStream[S], U]Parser[S, U, char] */
  const stringChar = label(
    mplus(stringLetter, stringEscape),
    "string character"
  );

  /*
     * identifier
     */
  const alpha = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");

  function alphaToLower(name) {
    return name.replace(/([A-Z])/g, c => c.toLowerCase());
  }

  function caseChar(c) {
    return alpha.has(c)
            ? mplus(
              char(c.toLowerCase()),
              char(c.toUpperCase())
            )
            : char(c);
  }

  function caseString(caseSensitive, str) {
    if (caseSensitive) {
      return string(str);
    }
    const msg = show(str);
    return bind(getConfig, config => {
      const unicode = config.unicode;
      const walk = ftailRecM(str => {
        const unconsed = unconsString(str, unicode);
        return unconsed.empty
                    ? map(pure(undefined), () => ({ done: true, value: undefined }))
                    : map(
                      label(
                        caseChar(unconsed.head),
                        msg
                      ),
                      () => ({ done: false, value: unconsed.tail })
                    );
      });
      return then(walk(str), pure(str));
    });
  }

  /**
   * type TokenParser[S, U] = {
   *   whiteSpace: Parser[S, U, undefined],
   *   lexeme: [A](parser: Parser[S, U, A]) => Parser[S, U, A],
   *   symbol: (name: string) => Parser[S, U, string],
   *   parens: [A](parser: Parser[S, U, A]) => Parser[S, U, A],
   *   braces: [A](parser: Parser[S, U, A]) => Parser[S, U, A],
   *   angles: [A](parser: Parser[S, U, A]) => Parser[S, U, A],
   *   brackets: [A](parser: Parser[S, U, A]) => Parser[S, U, A],
   *   semi: Parser[S, U, string],
   *   comma: Parser[S, U, string],
   *   colon: Parser[S, U, string],
   *   dot: Parser[S, U, string],
   *   semiSep: [A](parser: Parser[S, U, A]) => Parser[S, U, Array[A]],
   *   semiSep1: [A](parser: Parser[S, U, A]) => Parser[S, U, Array[A]],
   *   commaSep: [A](parser: Parser[S, U, A]) => Parser[S, U, Array[A]],
   *   commaSep1: [A](parser: Parser[S, U, A]) => Parser[S, U, Array[A]],
   *   decimal: Parser[S, U, int],
   *   hexadecimal: Parser[S, U, int],
   *   octal: Parser[S, U, int],
   *   natural: Parser[S, U, int],
   *   integer: Parser[S, U, int],
   *   float: Parser[S, U, float],
   *   naturalOrFloat: Parser[S, U, number],
   *   charLiteral: Parser[S, U, char],
   *   stringLiteral: Parser[S, U, string],
   *   identifier: Parser[S, U, string],
   *   reserved: (name: string) => Parser[S, U, undefined],
   *   operator: Parser[S, U, string],
   *   reservedOp: (name: string) => Parser[S, U, undefined],
   * }
   */

  /**
   * makeTokenParser: [S <: CharacterStream[S], U](def: LanguageDef[S, U]) => TokenParser[S, U]
   */
  function makeTokenParser(def) {
    const tp = {};

    /*
     * white space
     */
    const noOneLineComment = def.commentLine === "" || def.commentLine === undefined;
    const noMultiLineComment = def.commentStart === "" || def.commentEnd === ""
      || def.commentStart === undefined || def.commentEnd === undefined;
    /** whiteSpace: Parser[S, U, undefined]*/
    const whiteSpace = skipMany(label(
        noOneLineComment && noMultiLineComment ? simpleSpace
          : noOneLineComment ? mplus(
            simpleSpace,
            multiLineComment(def.commentStart, def.commentEnd, def.nestedComments)
          )
          : noMultiLineComment ? mplus(
            simpleSpace,
            oneLineComment(def.commentLine)
          )
          : mplus(
            simpleSpace,
            mplus(
              oneLineComment(def.commentLine),
              multiLineComment(def.commentStart, def.commentEnd, def.nestedComments)
            )
          ),
        ""
    ));
    /** lexeme: [A](parser: Parser[S, U, A]) => Parser[S, U, A] */
    function lexeme(parser) {
      return bind(parser, x => then(whiteSpace, pure(x)));
    }
    /** symbol: (name: string) => Parser[S, U, string] */
    function symbol(name) {
      return lexeme(string(name));
    }

    Object.assign(tp, {
      whiteSpace,
      lexeme,
      symbol,
    });

    /*
     * symbols
     */
    /** lparen: Parser[S, U, string] */
    const lparen = symbol("(");
    /** rparen: Parser[S, U, string] */
    const rparen = symbol(")");
    /** parens: [A](parser: Parser[S, U, A]) => Parser[S, U, A] */
    function parens(parser) {
      return between(lparen, rparen, parser);
    }

    /** lbrace: Parser[S, U, string] */
    const lbrace = symbol("{");
    /** rbrace: Parser[S, U, string] */
    const rbrace = symbol("}");
    /** braces: [A](parser: Parser[S, U, A]) => Parser[S, U, A] */
    function braces(parser) {
      return between(lbrace, rbrace, parser);
    }

    /** langle: Parser[S, U, string] */
    const langle = symbol("<");
    /** rangle: Parser[S, U, string] */
    const rangle = symbol(">");
    /** angles: [A](parser: Parser[S, U, A]) => Parser[S, U, A] */
    function angles(parser) {
      return between(langle, rangle, parser);
    }

    /** lbracket: Parser[S, U, string] */
    const lbracket = symbol("[");
    /** rbracket: Parser[S, U, string] */
    const rbracket = symbol("]");
    /** brackets: [A](parser: Parser[S, U, A]) => Parser[S, U, A] */
    function brackets(parser) {
      return between(lbracket, rbracket, parser);
    }

    /** semi: Parser[S, U, string] */
    const semi = symbol(";");
    /** comma: Parser[S, U, string] */
    const comma = symbol(",");
    /** colon: Parser[S, U, string] */
    const colon = symbol(":");
    /** dot: Parser[S, U, string] */
    const dot = symbol(".");

    /** semiSep: (parser: Parser[S, U, A]) => Parser[S, U, Array[A]] */
    function semiSep(parser) {
      return sepBy(parser, semi);
    }
    /** semiSep1: (parser: Parser[S, U, A]) => Parser[S, U, Array[A]] */
    function semiSep1(parser) {
      return sepBy1(parser, semi);
    }
    /** commaSep: (parser: Parser[S, U, A]) => Parser[S, U, Array[A]] */
    function commaSep(parser) {
      return sepBy(parser, comma);
    }
    /** commaSep1: (parser: Parser[S, U, A]) => Parser[S, U, Array[A]] */
    function commaSep1(parser) {
      return sepBy1(parser, comma);
    }

    Object.assign(tp, {
      parens,
      braces,
      angles,
      brackets,
      semi,
      comma,
      colon,
      dot,
      semiSep,
      semiSep1,
      commaSep,
      commaSep1,
    });

    /*
     * number literals
     */
    /** int: Parser[S, U, int] */
    const int = bind(lexeme(sign), f =>
      bind(nat, n =>
        pure(f(n))
      )
    );

    /** natural: Parser[S, U, int] */
    const natural = label(lexeme(nat), "natural");
    /** integer: Parser[S, U, int] */
    const integer = label(lexeme(int), "integer");
    /** float: Parser[S, U, float] */
    const float = label(lexeme(floating), "float");
    /** naturalOrFloat: Parser[S, U, NaturalOrFloat] */
    const naturalOrFloat = label(lexeme(natFloat), "number");

    Object.assign(tp, {
      decimal,
      hexadecimal,
      octal,
      natural,
      integer,
      float,
      naturalOrFloat,
    });

    /*
     * character / string literals
     */
    /** charLiteral: Parser[S, U, char] */
    const charLiteral = label(
      lexeme(
        between(
          char("'"),
          label(char("'"), "end of character"),
          characterChar
        )
      ),
      "character"
    );
    /** stringLiteral: Parser[S, U, string] */
    const stringLiteral = label(
      lexeme(
        between(
          char("\""),
          label(char("\""), "end of string"),
          manyChars(stringChar)
        )
      ),
      "literal string"
    );

    Object.assign(tp, {
      charLiteral,
      stringLiteral,
    });

    /*
         * identifier
         */
    if (isParser(def.idStart) && isParser(def.idLetter)) {
      const idStart  = def.idStart;
      const idLetter = def.idLetter;

      const caseSensitive = def.caseSensitive;

      const reservedIds   = def.reservedIds === undefined ? [] : def.reservedIds;
      const reservedIdSet = new Set(caseSensitive ? reservedIds : reservedIds.map(alphaToLower));
      const isReservedId  = name => reservedIdSet.has(caseSensitive ? name : alphaToLower(name));

      const ident = label(
        bind(idStart, c =>
          bind(manyChars(idLetter), cs =>
            pure(c + cs)
          )
        ),
        "identifier"
      );
      const identifier = lexeme(
        tryParse(
          bind(ident, name =>
                        isReservedId(name)
                        ? unexpected("reserved word " + show(name))
                        : pure(name)
          )
        )
      );

      const reserved = name =>
        lexeme(
          tryParse(
            then(
              caseString(caseSensitive, name),
              label(
                notFollowedBy(idLetter),
                "end of " + show(name)
              )
            )
          )
        );

      tp.identifier = identifier;
      tp.reserved   = reserved;
    }

    /*
         * operator
         */
    if (isParser(def.opStart) && isParser(def.opLetter)) {
      const opStart  = def.opStart;
      const opLetter = def.opLetter;

      const reservedOps   = def.reservedOps === undefined ? [] : def.reservedOps;
      const reservedOpSet = new Set(reservedOps);
      const isReservedOp  = name => reservedOpSet.has(name);

      const oper = label(
        bind(opStart, c =>
          bind(manyChars(opLetter), cs =>
            pure(c + cs)
          )
        ),
        "operator"
      );
      const operator = lexeme(
        tryParse(
          bind(oper, name =>
                        isReservedOp(name)
                        ? unexpected("reserved operator " + show(name))
                        : pure(name)
          )
        )
      );

      const reservedOp = name =>
        lexeme(
          tryParse(
            then(
              string(name),
              label(
                notFollowedBy(opLetter),
                "end of " + show(name)
              )
            )
          )
        );

      tp.operator   = operator;
      tp.reservedOp = reservedOp;
    }

    return tp;
  }

  return Object.create({
    makeTokenParser,
  });
};
