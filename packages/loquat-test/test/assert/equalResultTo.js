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
    // consumed
    expect(() => {
      const act = new Result(
        true,
        true,
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
      const exp = new Result(
        false,
        true,
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
    }).to.throw(AssertionError);
    expect(() => {
      const act = new Result(
        true,
        false,
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      const exp = new Result(
        false,
        false,
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      expect(act).to.be.an.equalResultTo(exp);
    }).to.throw(AssertionError);
    // success
    expect(() => {
      const act = new Result(
        true,
        true,
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
      const exp = new Result(
        true,
        false,
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      expect(act).to.be.an.equalResultTo(exp);
    }).to.throw(AssertionError);
    // err
    expect(() => {
      const act = new Result(
        true,
        true,
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
      const exp = new Result(
        true,
        true,
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
    }).to.throw(AssertionError);
    expect(() => {
      const act = new Result(
        true,
        false,
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      const exp = new Result(
        true,
        false,
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.EXPECT, "bar")]
        )
      );
      expect(act).to.be.an.equalResultTo(exp);
    }).to.throw(AssertionError);
    // val
    expect(() => {
      const act = new Result(
        true,
        true,
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
      const exp = new Result(
        false,
        true,
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        ),
        43,
        new State(
          new Config({ tabWidth: 4, unicode: true }),
          "input",
          new SourcePos("main", 497, 7, 29),
          "none"
        )
      );
      expect(act).to.be.an.equalResultTo(exp);
    }).to.throw(AssertionError);
    // state
    expect(() => {
      const act = new Result(
        true,
        true,
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
      const exp = new Result(
        false,
        true,
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
    }).to.throw(AssertionError);
    // customized equality
    const caseInsensitiveEqual = (x, y) => x.toLowerCase() === y.toLowerCase();
    expect(() => {
      const act = new Result(
        true,
        true,
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
      const exp = new Result(
        false,
        true,
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
    }).to.throw(AssertionError);
    expect(() => {
      const act = new Result(
        true,
        true,
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
      const exp = new Result(
        false,
        true,
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
    }).to.throw(AssertionError);
    expect(() => {
      const act = new Result(
        true,
        true,
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
      const exp = new Result(
        false,
        true,
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
    }).to.throw(AssertionError);
  });

  it("should not throw AssertionError if the actual result is equal to the expected one", () => {
    expect(() => {
      const act = new Result(
        true,
        true,
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
      const exp = new Result(
        true,
        true,
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
      const act = new Result(
        true,
        false,
        new StrictParseError(
          new SourcePos("main", 496, 6, 28),
          [ErrorMessage.create(ErrorMessageType.UNEXPECT, "foo")]
        )
      );
      const exp = new Result(
        true,
        false,
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
      const act = new Result(
        true,
        true,
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
      const exp = new Result(
        true,
        true,
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
      const act = new Result(
        true,
        true,
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
      const exp = new Result(
        true,
        true,
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
      const act = new Result(
        true,
        true,
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
      const exp = new Result(
        true,
        true,
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
      const act = new Result(
        true,
        true,
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
      const exp = new Result(
        true,
        true,
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

  it("should throw AssertionError if the object is not a `Result` instance", () => {
    const act = {};
    const exp = new Result(
      true,
      true,
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
    expect(() => {
      expect(act).to.be.an.equalResultTo(exp);
    }).to.throw(AssertionError);
    expect(() => {
      expect(act).to.not.be.an.equalResultTo(exp);
    }).to.throw(AssertionError);
  });
});
