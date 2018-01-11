/**
 * @overview Blessing Microservice Server File
 * @module index
 * @author Dominik Sigmund
 * @version 0.1
 * @description Starts the Server and keeps it running
 * @memberof botd-server
 * @requires express
 * @requires lib/database
 */

 // Require needed modules
 console.log('Starting up Blessing-API...')
 console.log('Pulling in dependencies...')
 var config = require('./config.json')
 /**
 * express module
 * @const
 */
 var express = require('express')
 var app = express()
 var server = require('http').createServer(app)
 var Blessings = require('./lib/blessings.js')
 var Calendar = require('./lib/calendar.js')

// Listen to Port
 if (process.argv.length >= 4) {
   config.port = process.argv[3]
 }
 server.listen(config.port)
 console.log('Blessing-API running on ' + config.port)

// Routes
 app.get('/', function (req, res) {

 })

/** Handles exitEvents by destroying open connections first
 * @function
* @param {object} options - Some Options
* @param {object} err - An Error Object
*/
 function exitHandler (options, err) {
   console.log('Exiting...')
   process.exit()
 }
  // catches ctrl+c event
 process.on('SIGINT', exitHandler)
  // catches uncaught exceptions
 process.on('uncaughtException', function (err) {
   console.error(err)
   exitHandler(null, err)
 })

  // keep running
 process.stdin.resume()
