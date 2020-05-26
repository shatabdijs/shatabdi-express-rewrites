import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.json({
    error: false,
    message: 'this is the root directory',
  })
})

app.get(
  '/home',
  (req, res, next) => {
    res.setHeader('x-author-name', 'YashKumarVerma')
    res.setHeader('x-author-email', 'yk.verma2000@gmail.com')
    next()
  },
  (req, res) => res.send('Check Headers'),
)

app.get(
  '/multiple',
  (req, res, next) => {
    res.setHeader('x-middleware-1', 'true')
    res.setHeader('x-middleware-2', 'true')
    next()
  },
  (req, res, next) => {
    res.setHeader('x-middleware-3', 'true')
    res.setHeader('x-middleware-4', 'true')
    next()
  },
  (req, res) => {
    res.setHeader('x-middleware-5', 'true')
    res.json({ finished: true })
  },
)

app.get('/params/:one/:two/:three/end', (req, res) => {
  res.json(req.params)
})

app.get('/response', (req, res) => {
  res.status(401).json({ status: 'unauthorized' })
})

export default app
