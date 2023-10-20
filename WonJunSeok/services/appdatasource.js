const { DataSource } = require('typeorm')
require("dotenv").config();

const appDataSource = new DataSource({
  type : process.env.TYPEORM_TYPE,
  host : process.env.TYPEORM_HOST,
  port : process.env.TYPEORM_PORT,
  username : process.env.TYPEORM_USERNAME,
  password : process.env.TYPEORM_PASSWORD,
  database : process.env.TYPEORM_DATABASES,
})

appDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })



module.exports = { appDataSource };
