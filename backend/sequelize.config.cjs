require('dotenv').config();

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error('DATABASE_URL is required to run sequelize-cli migrations');
}

/** @type {import('sequelize').Options} */
const common = {
  url,
  dialect: 'postgres',
  logging: false,
};

module.exports = {
  development: { ...common },
  test: { ...common },
  production: { ...common },
};
