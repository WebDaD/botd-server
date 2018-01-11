/**
 * @overview Database Lib
 * @module database
 * @author Dominik Sigmund
 * @version 1.0
 * @description Management of Memory Database and File-I/O
 * @memberof timo-data
 * @requires fs
 */
 /**
 * fs module
 * @const
 */
const fs = require('fs')

/** Creates a instance of class Database
 * @class Database
 * @throws {Error} Error
 * @param {string} dbfile - A path to the json-File
 * @param {uuidv4} uuid - An instance of a uuid-module. must have the method uuid()
 * @returns {Database} The Object
 * */
function Database (dbfile, uuid) {
  var self = {}
  self.file = dbfile
  self.uuid = uuid
  self.entries = JSON.parse(fs.readFileSync(self.file, 'utf8'))
  self.list = list
  self.sources = sources
  self.getEntry = getEntry
  self.addEntry = addEntry
  self.updateEntry = updateEntry
  self.deleteEntry = deleteEntry
  self.saveFile = saveFile
  return self
}
/** get a List of all Entries
 * @throws {Error} Error
 * @param {Database~listCallback} callback - A Callback with an error or the List of Entries
 * @returns Nothing
 * */
function list (callback) {
  if (!callback) {
    throw new Error('A callback must be given')
  }
  callback(null, this.entries)
}
/** get a List of all unique Sources in the Entries
 * @throws {Error} Error
 * @param {Database~sourceCallback} callback - A Callback with an error or the List of Sources
 * @returns Nothing
 * */
function sources (callback) {
  if (!callback) {
    throw new Error('A callback must be given')
  }
  var sources = []
  for (let index = 0; index < this.entries.length; index++) {
    const element = this.entries[index]
    if (sources.indexOf(element.source) < 0) {
      sources.push(element.source)
    }
  }
  callback(null, sources)
}
/** get an Entry by his ID
 * @throws {Error} Error
 * @param {string} id - An ID for an Entry
 * @param {Database~entryCallback} callback - A Callback with an error or the Entry
 * @returns Nothing
 * */
function getEntry (id, callback) {
  if (!callback) {
    throw new Error('A callback must be given')
  }
  for (let index = 0; index < this.entries.length; index++) {
    if (this.entries[index].id === id) {
      return callback(null, this.entries[index])
    }
  }
  callback(new Error('No Entry with id ' + id + ' found'))
}
/** add a new Entry
 * @throws {Error} Error
 * @param {Entry} entry - An Entry object, containing the properties source and link
 * @param {Database~entryCallback} callback - A Callback with an error or the Entry
 * @returns Nothing
 * */
function addEntry (entry, callback) {
  if (!callback) {
    throw new Error('A callback must be given')
  }
  if (entry.hasOwnProperty('source') && entry.hasOwnProperty('link')) {
    if (!entry.hasOwnProperty('id') && typeof entry['id'] !== 'string' && entry['id'].length !== 0) {
      entry.id = this.uuid()
    }
    this.entries.push(entry)
    this.saveFile(function (err) {
      if (err) {
        callback(err)
      } else {
        callback(null, entry)
      }
    })
  } else {
    callback(new Error('Entry not wellformed: ' + entry))
  }
}
/** update an Entry by ID
 * @throws {Error} Error
 * @param {string} id - An ID for an Entry
 * @param {Entry} entry - An Entry object, containing the properties source and link
 * @param {Database~entryCallback} callback - A Callback with an error or the Entry
 * @returns Nothing
 * */
function updateEntry (id, entry, callback) {
  if (!callback) {
    throw new Error('A callback must be given')
  }
  var updateIndex = this.entries.map(function (item) { return item.id }).indexOf(id)
  if (updateIndex > -1) {
    if (entry.hasOwnProperty('source') && entry.hasOwnProperty('link')) {
      entry.id = id
      this.entries[updateIndex] = entry
      this.saveFile(function (err) {
        if (err) {
          callback(err)
        } else {
          callback(null, entry)
        }
      })
    } else {
      callback({ status: 400, error: new Error('Entry not wellformed: ' + entry) })
    }
  } else {
    callback({ status: 404, error: new Error('No Entry with id ' + id + ' found') })
  }
}
/** delete an Entry by ID
 * @throws {Error} Error
 * @param {string} id - An ID for an Entry
 * @param {Database~deleteCallback} callback - A Callback with an error or true
 * @returns Nothing
 * */
function deleteEntry (id, callback) {
  if (!callback) {
    throw new Error('A callback must be given')
  }
  var removeIndex = this.entries.map(function (item) { return item.id }).indexOf(id)
  if (removeIndex > -1) {
    this.entries.splice(removeIndex, 1)
    this.saveFile(function (err) {
      if (err) {
        callback(err)
      } else {
        callback(null)
      }
    })
  } else {
    callback(new Error('No Entry with id ' + id + ' found'))
  }
}
/** saves all internal entries to the file
 * @throws {Error} Error
 * @param {Database~saveCallback} callback - A Callback with an error or nothing
 * @returns Nothing
 * */
function saveFile (callback) {
  if (!callback) {
    throw new Error('A callback must be given')
  }
  fs.writeFile(this.file, JSON.stringify(this.entries), 'utf8', callback)
}
module.exports = Database
/**
  * This callback is displayed as part of the Database class.
  * @callback Database~listCallback
  * @param {Error} Error or null
  * @param {array} Array of entries
  */
  /**
  * This callback is displayed as part of the Database class.
  * @callback Database~sourceCallback
  * @param {Error} Error or null
  * @param {array} Array of sources
  */
  /**
  * This callback is displayed as part of the Database class.
  * @callback Database~entryCallback
  * @param {Error} Error or null
  * @param {Entry} The Entry
  */
  /**
  * This callback is displayed as part of the Database class.
  * @callback Database~deleteCallback
  * @param {Error} Error or null
  * @param {bool} true for success
  */
  /**
  * This callback is displayed as part of the Database class.
  * @callback Database~saveCallback
  * @param {Error} Error or null
  */
