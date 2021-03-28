import { Pool } from 'pg'

const config = {
  host: 'localhost',
  port: '5432',
  database: 'letsshopping',
  user: 'postgres',
  password: 'root'
}

export default new Pool({
  max: 20,
  connectionString: `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`,
  idleTimeoutMillis: 30000
})
