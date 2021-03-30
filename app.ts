import Server from './server'

const port = parseInt(process.env.PORT || '4000')

const starter = new Server().start(port)
  .then(port => console.log(`Running on port ${port}`))
  .catch(error => console.log(error))


// import User from './src/models/user.model'
// User.create()

export default starter
