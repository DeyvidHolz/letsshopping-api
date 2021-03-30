import { Sequelize } from 'sequelize'
import dbConfig from './config/database.config'

const connection = new Sequelize({
  ...dbConfig,
  dialect: 'postgres'
})

connection.authenticate()
  .then(() => console.log('Database connection has been established successfully.'))
  .catch((err) => console.log(err))

const sequelize = new Sequelize(`postgres://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`)

export {
  connection,
  sequelize
}