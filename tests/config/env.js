require('dotenv').config();

const envConfig = {

  baseUrl: process.env.BASE_URL,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,

  aBaseURL: process.env.ABASE_URL,
  aUsername: process.env.AUSERNAME,
  aPassword: process.env.APASSWORD

};

module.exports = { envConfig };
