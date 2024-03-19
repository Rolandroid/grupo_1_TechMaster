require('dotenv').config();

module.exports = {
  development: {
    dialect: "sqlite",
    storage: "src/database/database/database.sqlite"
  },
  test: {
    dialect: "sqlite",
    storage: "src/database/database/database.sqlite"
  },
  production: {
    dialect: "sqlite",
    storage: "src/database/database/database.sqlite"
  }
}