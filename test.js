const expect = require('expect.js');

const factory = require('./');

describe('format', function () {
  describe('custom rules', function () {
    it('creates a format function based on custom defined rules', function () {
      const rules = {
        a(x) { return x * 10 },
        b(x) { return x * 20 },
      }

      const output = factory(rules)('|%a|%b|', 1, 2)
      expect(output).to.be('|10|40|')
    })

    it('ignores unknown flags, appends extra args to format', function () {
      const output = factory({})('1%a', 0)
      expect(output).to.be('1%a 0')
    })

    it('fails if your formats are not a single character', function () {
      expect(function () {
        factory({ cat() {} })
      })
      .to.throwError(/one character/);
    })
  })
})
