class Duplicate extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 11000;
  }
}

module.exports = Duplicate;
