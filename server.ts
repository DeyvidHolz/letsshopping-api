import Application from './app';

const port = parseInt(process.env.PORT || '3000');

new Application()
  .start(port)
  .then((port) => console.log(`Running on port ${port}`.green))
  .catch((error) => console.log(error));
