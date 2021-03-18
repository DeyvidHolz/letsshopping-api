import express from 'express'

const router = express.Router()

router.get('/', /* middleware */ (req, res) => {
  res.status(200).send('Hello world!')
})

export default router
