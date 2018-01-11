/* global it, describe, before, after, beforeEach, afterEach */
var assert = require('assert')
var dbSourcePath = './tests/database.json'
var dbPath = './tests/testdatabase.json'
var path = require('path')
var fs = require('fs')
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
var uuid = function () {
  return 'cd5e5247-9cce-4de9-acc9-0d17b3850f21'
}
var Database = require(path.join(__dirname, '../lib/database'))
var Tdatabase
describe('UT01: database', function () {
  before('UT01-00: Copy TestDatabase', function (done) {
    fs.copyFile(dbSourcePath, dbPath, function (err) {
      if (err) {
        done(err)
      } else {
        done()
      }
    })
  })
  describe('UT01-01: Object Contructor', function () {
    it('UT01-01-01: should return an error with no path', function (done) {
      try {
        Database()
        done(new Error('there should be an error here'))
      } catch (error) {
        done()
      }
    })
    it('UT01-01-02: should return an database object with a correct path', function (done) {
      try {
        var database = new Database(dbPath, uuid)
        assert.equal(database.file, dbPath)
        assert.equal(database.entries.length, 3)
        done()
      } catch (error) {
        done(error)
      }
    })
  })
  describe('UT01-02: database.list', function () {
    before(function (done) {
      Tdatabase = new Database(dbPath, uuid)
      done()
    })
    it('UT01-02-01: should throw an error with no callback given', function (done) {
      try {
        Tdatabase.list()
        done(new Error('there should be an error here'))
      } catch (error) {
        done()
      }
    })
    it('UT01-02-02: should callback all entries', function (done) {
      Tdatabase = new Database(dbPath, uuid)
      Tdatabase.list(function (error, entries) {
        if (error) {
          done(error)
        } else {
          assert.equal(entries.length, 3)
          assert.equal(entries[0].id, object1.id)
          assert.equal(entries[1].id, object2.id)
          assert.equal(entries[2].id, object3.id)
          Tdatabase = {}
          done()
        }
      })
    })
  })
  describe('UT01-03: database.sources', function () {
    it('UT01-03-01: should throw an error with no callback given', function (done) {
      Tdatabase = new Database(dbPath, uuid)
      try {
        Tdatabase.sources()
        done(new Error('there should be an error here'))
      } catch (error) {
        done()
      }
    })
    it('UT01-03-02: should callback all sources', function (done) {
      Tdatabase = new Database(dbPath, uuid)
      Tdatabase.sources(function (error, sources) {
        if (error) {
          done(error)
        } else {
          assert.equal(sources.length, 2)
          if (sources.indexOf('local') < 0) {
            done(new Error('Source local missing'))
          }
          if (sources.indexOf('youtube') < 0) {
            done(new Error('Source youtube missing'))
          }
          done()
        }
      })
    })
  })
  describe('UT01-04: database.getEntry', function () {
    beforeEach(function (done) {
      Tdatabase = new Database(dbPath, uuid)
      done()
    })
    it('UT01-04-01: should throw an error with no callback given', function (done) {
      try {
        Tdatabase.getEntry(object1.id)
        done(new Error('there should be an error here'))
      } catch (error) {
        done()
      }
    })
    it('UT01-04-02: should throw an error with no id given', function (done) {
      try {
        Tdatabase.getEntry()
        done(new Error('there should be an error here'))
      } catch (error) {
        done()
      }
    })
    it('UT01-04-03: should callback an error with a not existing id given', function (done) {
      Tdatabase.getEntry('#', function (error, entry) {
        if (error) {
          assert.equal(error.message, 'No Entry with id # found')
          done()
        } else {
          done(new Error('there should be an error here'))
        }
      })
    })
    it('UT01-04-04: should callback an object with a correct id given', function (done) {
      Tdatabase.getEntry(object1.id, function (error, entry) {
        if (error) {
          done(error)
        } else {
          assert.equal(object1.id, entry.id)
          done()
        }
      })
    })
    afterEach(function (done) {
      Tdatabase = {}
      done()
    })
  })
  describe('UT01-05: database.addEntry', function () {
    beforeEach(function (done) {
      Tdatabase = new Database(dbPath, uuid)
      done()
    })
    it('UT01-05-01: should throw an error with no data given', function (done) {
      try {
        Tdatabase.addEntry()
        done(new Error('there should be an error here'))
      } catch (error) {
        done()
      }
    })
    it('UT01-05-02: should throw an error with no callback given', function (done) {
      try {
        Tdatabase.addEntry(object4)
        done(new Error('there should be an error here'))
      } catch (error) {
        done()
      }
    })
    it('UT01-05-03: should callback an object with data given and database should contain this object', function (done) {
      Tdatabase.addEntry(object4, function (error, entry) {
        if (error) {
          done(error)
        } else {
          assert.equal(entry.id, object4.id)
          Tdatabase.list(function (error, entries) {
            if (error) {
              done(error)
            } else {
              assert.equal(entries.length, 4)
              assert.equal(entries[0].id, object1.id)
              assert.equal(entries[1].id, object2.id)
              assert.equal(entries[2].id, object3.id)
              assert.equal(entries[3].id, object4.id)
              done()
            }
          })
        }
      })
    })
    afterEach(function (done) {
      Tdatabase = {}
      done()
    })
  })
  describe('UT01-06: database.updateEntry', function () {
    beforeEach(function (done) {
      Tdatabase = new Database(dbPath, uuid)
      done()
    })
    it('UT01-06-01: should throw an error with no id given', function (done) {
      try {
        Tdatabase.updateEntry()
        done(new Error('there should be an error here'))
      } catch (error) {
        done()
      }
    })
    it('UT01-06-02: should throw an error with no data given', function (done) {
      try {
        Tdatabase.updateEntry(object5.id)
        done(new Error('there should be an error here'))
      } catch (error) {
        done()
      }
    })
    it('UT01-06-03: should throw an error with no callback given', function (done) {
      try {
        Tdatabase.updateEntry(object3.id, object4)
        done(new Error('there should be an error here'))
      } catch (error) {
        done()
      }
    })
    it('UT01-06-04: should callback an error with a not existing id given', function (done) {
      Tdatabase.updateEntry('#', object5, function (error, obj) {
        if (error) {
          done()
        } else {
          done(new Error('there should be an error here'))
        }
      })
    })
    it('UT01-06-05: should callback an object with id given and database should contain this changed object', function (done) {
      Tdatabase.updateEntry(object4.id, object5, function (error, entry) {
        if (error) {
          done(error)
        } else {
          assert.equal(entry.id, object4.id)
          assert.equal(entry.id, object5.id)
          Tdatabase.list(function (error, entries) {
            if (error) {
              done(error)
            } else {
              assert.equal(entries.length, 4)
              assert.equal(entries[0].id, object1.id)
              assert.equal(entries[1].id, object2.id)
              assert.equal(entries[2].id, object3.id)
              assert.equal(entries[3].id, object4.id)
              assert.equal(entries[3].link, object5.link)
              done()
            }
          })
        }
      })
    })
    afterEach(function (done) {
      Tdatabase = {}
      done()
    })
  })
  describe('UT01-07: database.deleteEntry', function () {
    beforeEach(function (done) {
      Tdatabase = new Database(dbPath, uuid)
      done()
    })
    it('UT01-07-01: should throw an error with no id given', function (done) {
      try {
        Tdatabase.deleteEntry()
        done(new Error('there should be an error here'))
      } catch (error) {
        done()
      }
    })
    it('UT01-07-02: should throw an error with no callback given', function (done) {
      try {
        Tdatabase.deleteEntry(object4.id)
        done(new Error('there should be an error here'))
      } catch (error) {
        done()
      }
    })
    it('UT01-07-03: should callback true with id given and database should not contain this object', function (done) {
      Tdatabase.deleteEntry(object4.id, function (error) {
        if (error) {
          done(error)
        } else {
          Tdatabase.list(function (error, entries) {
            if (error) {
              done(error)
            } else {
              assert.equal(entries.length, 3)
              assert.equal(entries[0].id, object1.id)
              assert.equal(entries[1].id, object2.id)
              assert.equal(entries[2].id, object3.id)
              done()
            }
          })
        }
      })
    })
    afterEach(function (done) {
      Tdatabase = {}
      done()
    })
  })
  after('UT01-99: remove Copy of Database', function (done) {
    fs.unlink(dbPath, function (error) {
      if (error) {
        done(error)
      } else {
        done()
      }
    })
  })
})
