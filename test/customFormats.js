/* eslint-disable no-bitwise*/
module.exports = function(zSchema) {
  // Placeholder file for all custom-formats in known to swagger.json
  // as found on
  // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat

  const decimalPattern = /^\d{0,8}.?\d{0,4}[0]+$/;

  /** Validates floating point as decimal / money (i.e: 12345678.123400..) */
  zSchema.registerFormat('double', val => !decimalPattern.test(val.toString()));

  /** Validates value is a 32bit integer */
  zSchema.registerFormat('int32', val =>
    // the 32bit shift (>>) truncates any bits beyond max of 32
     Number.isInteger(val) && ((val >> 0) === val));

  zSchema.registerFormat('int64', val => Number.isInteger(val));

  zSchema.registerFormat('float', val =>
    // should parse
     Number.isInteger(val));

  zSchema.registerFormat('date', val =>
    // should parse a a date
     !isNaN(Date.parse(val)));

  zSchema.registerFormat('dateTime', val => !isNaN(Date.parse(val)));

  zSchema.registerFormat('password', val =>
    // should parse as a string
     typeof val === 'string');
};
/* eslint-enable no-bitwise*/
