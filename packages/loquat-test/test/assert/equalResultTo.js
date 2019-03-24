"use strict";

const { expect, AssertionError } = require("chai");

const {
  SourcePos,
  ErrorMessageType,
  ErrorMessage,
  StrictParseError,
  Config,
  State,
  Result,
} = _core;

describe("equalResultTo", () => {
  it("should throw AssertionError if the actual result is not equal to the expected one", () => {
    // success
    expect(() => {
      const act = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const exp = Result.cfail(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      expect(act).to.be.an.equalResultTo(exp);
    }).to.throw(AssertionError, /Result/);
    // consumed
    expect(() => {
      const act = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const exp = Result.esucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      expect(act).to.be.an.equalResultTo(exp);
    }).to.throw(AssertionError, /Result/);
    expect(() => {
      const act = Result.cfail(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      const exp = Result.efail(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      expect(act).to.be.an.equalResultTo(exp);
    }).to.throw(AssertionError, /Result/);
    // err
    expect(() => {
      const act = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const exp = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.EXPECT, "bar")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      expect(act).to.be.an.equalResultTo(exp);
    }).to.throw(AssertionError, /Result/);
    expect(() => {
      const act = Result.cfail(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      const exp = Result.cfail(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.EXPECT, "bar")]
        )
      );
      expect(act).to.be.an.equalResultTo(exp);
    }).to.throw(AssertionError, /Result/);
    // val
    expect(() => {
      const act = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const exp = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        42,
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      expect(act).to.be.an.equalResultTo(exp);
    }).to.throw(AssertionError, /Result/);
    // state
    expect(() => {
      const act = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const exp = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 8, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "some"
        )
      );
      expect(act).to.be.an.equalResultTo(exp);
    }).to.throw(AssertionError, /Result/);
    // customized equality
    const caseInsensitiveEqual = (x, y) => x.toLowerCase() === y.toLowerCase();
    expect(() => {
      const act = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const exp = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "INPUT",
          new SourcePos("main", 497, 7, 29),
          "NONE"
        )
      );
      expect(act).to.be.an.equalResultTo(exp, caseInsensitiveEqual);
    }).to.throw(AssertionError, /Result/);
    expect(() => {
      const act = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const exp = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "NYANCAT",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "NONE"
        )
      );
      expect(act).to.be.an.equalResultTo(exp, undefined, caseInsensitiveEqual);
    }).to.throw(AssertionError, /Result/);
    expect(() => {
      const act = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const exp = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "NYANCAT",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "INPUT",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      expect(act).to.be.an.equalResultTo(exp, undefined, undefined, caseInsensitiveEqual);
    }).to.throw(AssertionError, /Result/);
  });

  it("should not throw AssertionError if the actual result is equal to the expected one", () => {
    expect(() => {
      const act = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "bar",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const exp = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "bar",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      expect(act).to.be.an.equalResultTo(exp);
    }).to.not.throw(AssertionError);
    expect(() => {
      const act = Result.cfail(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      const exp = Result.cfail(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      expect(act).to.be.an.equalResultTo(exp);
    }).to.not.throw(AssertionError);
    // customized equality
    const caseInsensitiveEqual = (x, y) => x.toLowerCase() === y.toLowerCase();
    expect(() => {
      const act = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const exp = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "NYANCAT",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      expect(act).to.be.an.equalResultTo(exp, caseInsensitiveEqual);
    }).to.not.throw(AssertionError);
    expect(() => {
      const act = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const exp = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "INPUT",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      expect(act).to.be.an.equalResultTo(exp, undefined, caseInsensitiveEqual);
    }).to.not.throw(AssertionError);
    expect(() => {
      const act = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const exp = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "NONE"
        )
      );
      expect(act).to.be.an.equalResultTo(exp, undefined, undefined, caseInsensitiveEqual);
    }).to.not.throw(AssertionError);
    expect(() => {
      const act = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "nyancat",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      const exp = Result.csucc(
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        "NYANCAT",
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "INPUT",
          new SourcePos("main", 497, 7, 29),
          "NONE"
        )
      );
      expect(act).to.be.an.equalResultTo(
        exp, caseInsensitiveEqual, caseInsensitiveEqual, caseInsensitiveEqual
      );
    }).to.not.throw(AssertionError);
  });
});
