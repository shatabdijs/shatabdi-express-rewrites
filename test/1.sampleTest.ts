/* eslint-disable no-unused-expressions */
import { describe, it } from 'mocha'
import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../src/app'

chai.use(chaiHttp)
const { expect } = chai

const worker = chai.request(app).keepOpen()

describe(' => Testing Framework Components', () => {
  /**
   * Test if the root directory is being catched by
   * router * Very common bug due to splitting due to
   *  slashes and trimming tail slashes
   */
  it('Testing root directory attachment', (done) => {
    worker
      .get('/')
      .then((resp) => {
        expect(resp.body.error).to.be.false
        expect(resp.body.message).to.be.a('string')
        done()
      })
      .catch((err) => done(err))
  })

  /**
   * Test if headers are successfully received when sent
   * from same router layer
   */
  it('testing sending of multiple headers from single layer', (done) => {
    worker
      .get('/home')
      .then((resp) => {
        expect(resp.status).to.equal(200)
        expect(resp.error).to.be.false
        expect(resp.header['x-author-name']).to.equal('YashKumarVerma')
        expect(resp.header['x-author-email']).to.equal('yk.verma2000@gmail.com')
        done()
      })
      .catch((err) => console.log(err.message))
  })

  /**
   * Test if headers are successfully set when done from
   * multiple middlwares ( layers)
   */
  it('testing sending of multiple headers from multiple layer', (done) => {
    worker
      .get('/multiple')
      .then((resp) => {
        expect(resp.status).to.equal(200)
        expect(resp.error).to.be.false
        expect(resp.body.finished).to.be.true
        expect(resp.header['x-middleware-1']).to.equal('true')
        expect(resp.header['x-middleware-2']).to.equal('true')
        expect(resp.header['x-middleware-3']).to.equal('true')
        expect(resp.header['x-middleware-4']).to.equal('true')
        expect(resp.header['x-middleware-5']).to.equal('true')
        done()
      })
      .catch((err) => done(err))
  })

  /**
   * Test if router is able to correctly match routes
   * and extract params from url
   */
  it('testing param extraction from request', (done) => {
    worker
      .get('/params/apple/mango/banana/end')
      .then((resp) => {
        expect(resp.status).to.equal(200)
        expect(resp.body.one).to.equal('apple')
        expect(resp.body.two).to.equal('mango')
        expect(resp.body.three).to.equal('banana')
        done()
      })
      .catch((err) => done(err))
  })

  /**
   * Check default 404 response
   */
  it('testing default 404 response if none matches', (done) => {
    worker
      .get('/yashkumarverma')
      .then((resp) => {
        expect(resp.status).to.equal(404)
        done()
      })
      .catch((err) => done(err))
  })

  /**
   * Check custom response code usage
   */
  it('testing custom response code', (done) => {
    worker
      .get('/response')
      .then((resp) => {
        expect(resp.status).to.equal(401)
        done()
      })
      .catch((err) => done(err))
  })

  /**
   * Check that different method types don't trigger wrong routes
   */
  it('route registered as GET should reject request made as post', (done) => {
    worker
      .post('/home')
      .then((resp) => {
        expect(resp.status).to.equal(404)
        done()
      })
      .catch((err) => done(err))
  })

  it('route registered as GET should reject request made as put', (done) => {
    worker
      .put('/home')
      .then((resp) => {
        expect(resp.status).to.equal(404)
        done()
      })
      .catch((err) => done(err))
  })

  it('route registered as GET should reject request made as delete', (done) => {
    worker
      .delete('/home')
      .then((resp) => {
        expect(resp.status).to.equal(404)
        done()
      })
      .catch((err) => done(err))
  })
})
