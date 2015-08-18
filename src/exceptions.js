function StrictViolationException() {
  this.message = '[MappersmithObject] This object is configured with "strict: true" and doesn\'t ' +
  ' allow undefined keys';
  this.toString = function() {
    return this.message;
  }
}

module.exports = {
  StrictViolationException: StrictViolationException
}
