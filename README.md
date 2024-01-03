# php-date-format

[![NPM](https://nodei.co/npm/php-date-format.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/php-date-format/)

A node.js package for PHP style format date.

- No dependencies package
- Support escape

## Installation

```sh
npm install php-date-format
```

## Usage
```javascript
var format = require('php-date-format');
// defaults to ISO8601 format and current date
format();
// output: 2024-01-03T15:04:13.020+09:00

// time
format('H:i:s.v', new Date('2024-01-13T15:04:13.02+09:00'));
// output: 15:04:13.020

// week dates
format('Y-\\WW-N');
// ouptut: 2024-W01-3

// RFC 2822 / RFC 5322 formatted date
format('r');
format('D, d M Y H:i:s O');
// output: Wed, 03 Jan 2024 15:04:13 +0900
```

## Formats

Should support most PHP date formats, see https://www.php.net/manual/en/datetime.format.php

## Note

- Only support local time
- Timezone format (`O`, `P`, `p`) returns local tz (`process.env.TZ`)
- Timezone abbreviation (`T`) does not support. Returns `UTC` or `GMT+0900`
