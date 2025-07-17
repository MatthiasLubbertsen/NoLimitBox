const app = require('../app');

module.exports = (req, res) => {
  // Vercel calls deze functie voor ieder request
  return app(req, res);
};