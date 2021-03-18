import express from 'express'

// Importing configs
import appConfig from './config/app.config'

// Importing routes
import homeRoutes from './routes/home.routes'

const app = express()

app.use(homeRoutes)

app.listen(appConfig.port, () => console.log(`App running on ${appConfig.port}`))
