/* global it, describe, before, after */
var assert = require('assert')
var superagent = require('superagent')
var status = require('http-status')
var ip = require('ip')
var fs = require('fs')
const spawn = require('child_process').spawn
var dbSourcePath = './tests/database.json'
var dbPath = './tests/testdatabase.json'
var testPort = 55555
var object1 = {
  id: 'ef5e5247-9cce-4de9-acc9-0d17b3850f94',
  source: 'local',
  link: '/var/files/test.mp3',
  comment: 'My First mp3'
}
var object2 = {
  id: 'ef5e5247-9cce-4de9-acc9-0d17b3850f78',
  source: 'youtube',
  link: 'http://alink',
  comment: 'Very Cool Video with awesome sound'
}
var object3 = {
  id: 'ef5e5247-9cce-4de9-acc9-0d17b3850f21',
  source: 'local',
  link: '/var/files/test4.mp3',
  comment: ''
}
var object4 = {
  id: 'cd5e5247-9cce-4de9-acc9-0d17b3850f21',
  source: 'local',
  link: '/var/files/testnew.mp3',
  comment: ' A whole new file'
}
var object5 = {
  id: 'cd5e5247-9cce-4de9-acc9-0d17b3850f21',
  source: 'local',
  link: '/var/files/another.mp3',
  comment: 'some mp3 i found'
}
var server
describe('UT02: API', function () {
  const uri = 'http://' + ip.address() + ':' + testPort
  before(function (done) {
    fs.copyFile(dbSourcePath, dbPath, function (err) {
      if (err) {
        done(err)
      } else {
        server = spawn('node', ['./app.js', dbPath, testPort])
        setTimeout(function () {
          done()
        }, 1000)
      }
    })
  })
  describe('UT02-01: GET /', function () {
    it('UT02-01-01: Should List all Entries', function (done) {
      superagent.get(uri + '/').end(function (err, res) {
        assert.ifError(err)
        assert.equal(res.status, status.OK)
        var result = JSON.parse(res.text)
        assert.equal(result.length, 3)
        assert.equal(result[0].id, object1.id)
        assert.equal(result[1].id, object2.id)
        assert.equal(result[2].id, object3.id)
        done()
      })
    })
  })
  describe('UT02-02: GET /sources', function () {
    it('UT02-02-01: Should List all sources', function (done) {
      superagent.get(uri + '/sources').end(function (err, res) {
        assert.ifError(err)
        assert.equal(res.status, status.OK)
        var result = JSON.parse(res.text)
        assert.equal(result.length, 2)
        if (result.indexOf('local') < 0) {
          done(new Error('Source local missing'))
        }
        if (result.indexOf('youtube') < 0) {
          done(new Error('Source youtube missing'))
        }
        done()
      })
    })
  })
  describe('UT02-03: GET /:id', function () {
    it('UT02-03-01: Should get entry by id', function (done) {
      superagent.get(uri + '/' + object1.id).end(function (err, res) {
        assert.ifError(err)
        assert.equal(res.status, status.OK)
        var result = JSON.parse(res.text)
        assert.equal(result.id, object1.id)
        assert.equal(result.link, object1.link)
        done()
      })
    })
    it('UT02-03-02: Should get 404 on wrong id', function (done) {
      superagent.get(uri + '/some-id').end(function (err, res) {
        if (err) {
          assert.equal(res.status, status.NOT_FOUND)
          done()
        } else {
          done(new Error('Here be an Error'))
        }
      })
    })
  })
  describe('UT02-04: POST /', function () {
    it('UT02-04-01: Should Add an Entry', function (done) {
      superagent.post(uri + '/').send(object4).end(function (err, res) {
        assert.ifError(err)
        assert.equal(res.status, status.CREATED)
        var result = JSON.parse(res.text)
        assert.equal(result.id, object4.id)
        superagent.get(uri + '/').end(function (err, res) {
          assert.ifError(err)
          assert.equal(res.status, status.OK)
          var result = JSON.parse(res.text)
          assert.equal(result.length, 4)
          assert.equal(result[0].id, object1.id)
          assert.equal(result[1].id, object2.id)
          assert.equal(result[2].id, object3.id)
          assert.equal(result[3].id, object4.id)
          done()
        })
      })
    })
    it('UT02-04-02: Should Error on no Data in Post', function (done) {
      superagent.post(uri + '/').send({}).end(function (err, res) {
        if (err) {
          assert.equal(res.status, status.BAD_REQUEST)
          superagent.get(uri + '/').end(function (err, res) {
            assert.ifError(err)
            assert.equal(res.status, status.OK)
            var result = JSON.parse(res.text)
            assert.equal(result.length, 4)
            assert.equal(result[0].id, object1.id)
            assert.equal(result[1].id, object2.id)
            assert.equal(result[2].id, object3.id)
            assert.equal(result[3].id, object4.id)
            done()
          })
        } else {
          done(new Error('Here be an Error'))
        }
      })
    })
  })
  describe('UT02-05: PUT /:id', function () {
    it('UT02-05-01: Should Update an Entry', function (done) {
      superagent.put(uri + '/' + object4.id).send(object5).end(function (err, res) {
        assert.ifError(err)
        assert.equal(res.status, status.OK)
        var result = JSON.parse(res.text)
        assert.equal(result.id, object5.id)
        assert.equal(result.link, object5.link)
        superagent.get(uri + '/').end(function (err, res) {
          assert.ifError(err)
          assert.equal(res.status, status.OK)
          var result = JSON.parse(res.text)
          assert.equal(result.length, 4)
          assert.equal(result[0].id, object1.id)
          assert.equal(result[1].id, object2.id)
          assert.equal(result[2].id, object3.id)
          assert.equal(result[3].id, object4.id)
          assert.equal(result[3].id, object5.id)
          assert.equal(result[3].link, object5.link)
          done()
        })
      })
    })
    it('UT02-05-02: Should Error on no Data in PUT', function (done) {
      superagent.put(uri + '/' + object4.id).send({}).end(function (err, res) {
        if (err) {
          assert.equal(res.status, status.BAD_REQUEST)
          superagent.get(uri + '/').end(function (err, res) {
            assert.ifError(err)
            assert.equal(res.status, status.OK)
            var result = JSON.parse(res.text)
            assert.equal(result.length, 4)
            assert.equal(result[0].id, object1.id)
            assert.equal(result[1].id, object2.id)
            assert.equal(result[2].id, object3.id)
            assert.equal(result[3].id, object4.id)
            assert.equal(result[3].link, object5.link)
            done()
          })
        } else {
          done(new Error('Here be an Error'))
        }
      })
    })
    it('UT02-05-03: Should Error on wrong ID', function (done) {
      superagent.put(uri + '/someid').send(object4).end(function (err, res) {
        if (err) {
          assert.equal(res.status, status.NOT_FOUND)
          superagent.get(uri + '/').end(function (err, res) {
            assert.ifError(err)
            assert.equal(res.status, status.OK)
            var result = JSON.parse(res.text)
            assert.equal(result.length, 4)
            assert.equal(result[0].id, object1.id)
            assert.equal(result[1].id, object2.id)
            assert.equal(result[2].id, object3.id)
            assert.equal(result[3].id, object4.id)
            assert.equal(result[3].link, object5.link)
            done()
          })
        } else {
          done(new Error('Here be an Error'))
        }
      })
    })
  })
  describe('UT02-06: DELETE /:id', function () {
    it('UT02-06-01: Should Delete an Account', function (done) {
      superagent.delete(uri + '/' + object4.id).end(function (err, res) {
        assert.ifError(err)
        assert.equal(res.status, status.OK)
        var result = JSON.parse(res.text)
        assert.equal(result, true)
        superagent.get(uri + '/').end(function (err, res) {
          assert.ifError(err)
          assert.equal(res.status, status.OK)
          var result = JSON.parse(res.text)
          assert.equal(result.length, 3)
          assert.equal(result[0].id, object1.id)
          assert.equal(result[1].id, object2.id)
          assert.equal(result[2].id, object3.id)
          done()
        })
      })
    })
    it('UT02-06-02: Should Error on wrong ID', function (done) {
      superagent.delete(uri + '/someid').end(function (err, res) {
        if (err) {
          assert.equal(res.status, status.NOT_FOUND)
          superagent.get(uri + '/').end(function (err, res) {
            assert.ifError(err)
            assert.equal(res.status, status.OK)
            var result = JSON.parse(res.text)
            assert.equal(result.length, 3)
            assert.equal(result[0].id, object1.id)
            assert.equal(result[1].id, object2.id)
            assert.equal(result[2].id, object3.id)
            done()
          })
        } else {
          done(new Error('Here be an Error'))
        }
      })
    })
  })
  after(function (done) {
    server.kill('SIGHUP')
    setTimeout(function () {
      fs.unlink(dbPath, function (error) {
        if (error) {
          done(error)
        } else {
          done()
        }
      })
    }, 1000)
  })
})
