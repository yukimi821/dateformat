import { createRequire } from "module";
const require = createRequire(import.meta.url);
var format = require('./dateformat.cjs');
export default format;
