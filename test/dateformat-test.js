import { createRequire } from 'module';
import assert from 'node:assert';

const require = createRequire(import.meta.url);
var format = require('../lib/dateformat.cjs');

process.env.TZ = 'Asia/Tokyo';
const testDate = new Date('2024-01-02T13:06:34.02+09:00');
format.now = () => testDate;

const values = {
  d: '02',
  D: 'Tue',
  j: '2',
  l: 'Tuesday',
  N: '2',
  S: 'nd',
  w: '2',
  z: '1',
  W: '01',
  F: 'January',
  m: '01',
  M: 'Jan',
  n: '1',
  t: '31',
  L: '1',
  o: '2024',
  X: '+2024',
  x: '2024',
  Y: '2024',
  a: 'pm',
  A: 'PM',
  B: '212',
  g: '1',
  G: '13',
  h: '01',
  H: '13',
  i: '06',
  s: '34',
  u: '020000',
  v: '020',
  e: 'Asia/Tokyo',
  I: '0',
  O: '+0900',
  P: '+09:00',
  T: 'GMT+0900',
  Z: '32400',
  c: '2024-01-02T13:06:34+09:00',
  r: 'Tue, 02 Jan 2024 13:06:34 +0900',
  U: '1704168394',
};

describe('dateformat', function() {
  it('should default to now when a date is not provided', function () {
    assert.doesNotThrow(format);
    assert.equal(format(), '2024-01-02T13:06:34.020+09:00');
  });
  it('should invert format and date', function() {
    assert.equal(format(testDate, 'Y'), '2024');
  });
  Object.entries(values).forEach(function ([key, value]) {
    it('`' + key + '` should be `' + value + '`', function () {
      assert.equal(format(key), value);
    });
  });

  // week number and week-numbering year
  it('should be next year\'s week number', function () {
    assert.equal(format('W', new Date('2013-12-31')), '01');
  });
  it('should be the next year', function () {
    assert.equal(format('o', new Date('2013-12-31')), '2014');
  });
  it('should be end of year\'s week number', function () {
    assert.equal(format('W', new Date('2020-12-31')), '53');
  });
  it('should be the next year\'s week number when last year\'s week number is not same', function () {
    assert.equal(format('W', new Date('2018-12-31')), '01');
  });
  it('should be before year\s week number', function () {
    assert.equal(format('W', new Date('2023-01-01')), '52');
  });
  it('should be the before year', function () {
    assert.equal(format('o', new Date('2023-01-01')), '2022');
  });

  // English suffix
  it('should be 1st', function () {
    assert.equal(format('jS', new Date('2024-01-01')), '1st');
  });
  it('should be 3rd', function () {
    assert.equal(format('jS', new Date('2024-01-03')), '3rd');
  });
  it('should be 4th', function () {
    assert.equal(format('jS', new Date('2024-01-04')), '4th');
  });
  it('should be 11th', function () {
    assert.equal(format('jS', new Date('2024-01-11')), '11th');
  });
  it('should be 21st', function () {
    assert.equal(format('jS', new Date('2024-01-21')), '21st');
  });
  it('should be 24th', function () {
    assert.equal(format('jS', new Date('2024-01-24')), '24th');
  });
  it('should be 31st', function () {
    assert.equal(format('jS', new Date('2024-01-31')), '31st');
  });

  // year's sign
  it('should return minus year', function () {
    assert.equal(format('X', new Date('2024-01-01').setYear(-55)), '-0055');
  });
  it('should return not plus sign', function () {
    assert.equal(format('x', new Date('2024-01-01')), '2024');
  });
  it('should return plus sign', function () {
    assert.equal(format('x', new Date('2024-01-01').setYear(10000)), '+10000');
  });

  // summar time
  it('should return summer time flag', function () {
    process.env.TZ = 'Europe/London',
    assert.equal(format('I', new Date('2024-07-01')), '1');
  });
});
