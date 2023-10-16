const { DataSource } = require('typeorm')

const appDataSource = new DataSource({
  type: 'mysql',
 host: 'localhost',
  port: '3306',
  username: 'root',
  password: '863870',
 database: 'wecode_thread'
})  

appDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  
  

  module.exports = { appDataSource };
