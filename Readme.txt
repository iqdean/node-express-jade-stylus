Create web-based UI to remote control usb-relay08 card 
---------------------------------------------------------------------

PART 1 - Node/express code for linux-based server/embedded sys connected to usb-relay08 card
-------

see UsbRlyHandler(buttonArray[], serialPort)    <- already done


Part 2 - UI to enable remote control of relays thru browser over the network
------

TODO


Big Picture
-----------

PC
Client                        	      Server - USB_PORT - usb-relay08 card

browser   	>http req ip:port>    GET   /usbrelay08
                                       
				       read current state of relays (if possible?)  <----------\  closed loop
          	< input form <----     show current state in checkboxes of the input form	| if relay card 
user												| has way to read
selects/chgs	 										| current state
the checkboxes											| of relays from h/w
on the form                                                                                     /
     clks submit  --------------->    POST  --> buttonAction[] -> usb-relay08.js -> /dev/ttyACM?
                                                                  write buttonAction[] 
								  to selected relay

--- TODO ---  add a page for
 
PC Client	  Wired 	      Server
   	      <-- network -->	      RaspberryPi2 - I2C_PORT - i2cGPIO_card - ArduinoRelay


PART 2 - UI  - based on node/express/jade/stylus    
-----------

REF:
[1] http://www.clock.co.uk/blog/a-simple-website-in-nodejs-with-express-jade-and-stylus
 
[2] http://www.clock.co.uk/blog/a-simple-website-in-node-js-2016-edition
---------------------------------------------------------------------

SHORTCUT:
https://github.com/bengourley/basic-express-site-2016

Manual Steps TO UNDERSTAND HOW TO SETUP FROM SCRATCH
----------------------------------------------------
1. undo npm proxy settings to make it work on home wifi

2. setup example website at url above & add a page to remote-control a usb-relay08 card

2.1 $ npm init

About to write to C:\Users\iadean\Documents\2016\SWDEV\SW-Dev-Programming\js-node-npm-express\nodejs-book\9-node-express-jade-sytlus\package.json:

{
  "name": "9-node-express-jade-sytlus",
  "version": "1.0.0",
  "description": "ui to rc relays",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}


Is this ok? (yes) yes

2.2 $ npm i --save express@4 morgan@1		<- WTF is the @X Do?
npm WARN package.json 9-node-express-jade-sytlus@1.0.0 No repository field.
morgan@1.7.0 node_modules\morgan
├── on-headers@1.0.1
├── basic-auth@1.0.3
├── depd@1.1.0
├── on-finished@2.3.0 (ee-first@1.1.1)
└── debug@2.2.0 (ms@0.7.1)

express@4.13.4 node_modules\express		@4 -> latest version 4.x.x must be 4.13.4
├── escape-html@1.0.3
├── merge-descriptors@1.0.1
├── etag@1.7.0
├── vary@1.0.1
├── methods@1.1.2
├── content-type@1.0.1
├── cookie-signature@1.0.6
├── range-parser@1.0.3
├── parseurl@1.3.1
├── path-to-regexp@0.1.7
├── cookie@0.1.5
├── serve-static@1.10.2
├── array-flatten@1.1.1
├── utils-merge@1.0.0
├── content-disposition@0.5.1
├── fresh@0.3.0
├── depd@1.1.0
├── qs@4.0.0
├── on-finished@2.3.0 (ee-first@1.1.1)
├── finalhandler@0.4.1 (unpipe@1.0.0)
├── debug@2.2.0 (ms@0.7.1)
├── proxy-addr@1.0.10 (forwarded@0.1.0, ipaddr.js@1.0.5)
├── accepts@1.2.13 (negotiator@0.5.3, mime-types@2.1.10)
├── type-is@1.6.12 (media-typer@0.3.0, mime-types@2.1.10)
└── send@0.13.1 (destroy@1.0.4, statuses@1.2.1, ms@0.7.1, mime@1.3.4, http-errors@1.3.1)

2.3  $ npm i --save jade@1 stylus@0
npm WARN package.json 9-node-express-jade-sytlus@1.0.0 No repository field.
stylus@0.54.2 node_modules\stylus
├── css-parse@1.7.0
├── debug@2.2.0 (ms@0.7.1)
├── mkdirp@0.5.1 (minimist@0.0.8)
├── sax@0.5.8
├── source-map@0.1.43 (amdefine@1.0.0)
└── glob@3.2.11 (inherits@2.0.1, minimatch@0.3.0)

jade@1.11.0 node_modules\jade
├── character-parser@1.2.1
├── commander@2.6.0
├── void-elements@2.0.1
├── mkdirp@0.5.1 (minimist@0.0.8)
├── jstransformer@0.0.2 (is-promise@2.1.0, promise@6.1.0)
├── constantinople@3.0.2 (acorn@2.7.0)
├── with@4.0.3 (acorn@1.2.2, acorn-globals@1.0.9)
├── clean-css@3.4.10 (commander@2.8.1, source-map@0.4.4)
├── transformers@2.1.0 (promise@2.0.0, css@1.0.8, uglify-js@2.2.5)
└── uglify-js@2.6.2 (async@0.2.10, uglify-to-browserify@1.0.2, source-map@0.5.3, yargs@3.10.0)

2.4 $ npm i --save nodemon@1.9	   < nodemon. It does a great job at watching files and restarting on change
      	    	   		     Required by the BUILD scripts below

$ npm i --save nodemon@1.9
npm WARN package.json 9-node-express-jade-sytlus@1.0.0 No repository field.
npm WARN optional dep failed, continuing fsevents@1.0.8
nodemon@1.9.1 node_modules\nodemon
├── ignore-by-default@1.0.1
├── undefsafe@0.0.3
├── es6-promise@3.1.2
├── debug@2.2.0 (ms@0.7.1)
├── touch@1.0.0 (nopt@1.0.10)
├── minimatch@3.0.0 (brace-expansion@1.1.3)
├── lodash.defaults@3.1.2 (lodash.restparam@3.6.1, lodash.assign@3.2.0)
├── ps-tree@1.0.1 (event-stream@3.3.2)
├── update-notifier@0.5.0 (is-npm@1.0.0, semver-diff@2.1.0, repeating@1.1.3, string-length@1.0.1, chalk@1.1.1, configstore@1.4.0, latest-version@1.0.1)
└── chokidar@1.4.3 (path-is-absolute@1.0.0, inherits@2.0.1, glob-parent@2.0.0, async-each@1.0.0, is-binary-path@1.0.1, is-glob@2.0.1, readdirp@2.0.0, anymatch@1.3.0)


2.5 Update package.json to add BUILD scripts in the scripts { }  section
    >>>> you use these scripts to build the project when u make changes to it <<<<


Running commands is simple: npm run <name>

npm run build-css – this uses the Stylus CLI to compile the index.styl stylesheet to css, and place it in the static/css directory
npm run watch-css – this is exactly the same as the previous command, except that it will continue running until manually stopped, compiling the stylesheet any time the source files are change. This task essentially supersedes the stylus middleware I mentioned earlier.
npm run clean – this removes any built files (currently only css, but it might later include browserify-ed JS) and creates any required directories.
npm run build – this does everything required for the server to run correctly, which is just to run the clean and build-css commands
npm run watch – this is the command that is most useful in development. It will watch the entire project for changes and recompile assets or restart the server accordingly.
npm run start – this simply starts the server and does no watching at all.



BEFORE: see package.json above

AFTER:
$ cat package.json
{
  "name": "9-node-express-jade-sytlus",
  "version": "1.0.0",
  "description": "ui to rc relays",
  "main": "index.js",
  "scripts": {
    "build-css": "stylus source/stylesheets/index.styl -o static/css",
    "watch-css": "stylus source/stylesheets/index.styl -o static/css -w",
    "clean": "rm -rf static\\css && mkdir -p static\\css",
    "build": "npm run clean && npm run build-css",
    "watch": "npm run clean && npm run watch-css & nodemon server -e js,jade",
    "start": "node server"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.13.4",
    "jade": "^1.11.0",
    "morgan": "^1.7.0",
    "nodemon": "^1.9.1",
    "stylus": "^0.54.2"
  }
}

NOTE1:
As you install npm packages, it adds to the "dependencies" list.
when u distribute ur node app (ex: on git hub) u dont need to
include the node_modules dir, recipient can install all the deps
using npm & the package.json file by doing:
$ npm install     from the root dir of the project 
                  same dir used to do all the $ npm i blah_blah above

NOTE2: 

  "clean": "rm -rf static\css && mkdir -p static\css",                          <- for linux
  XOR
  "clean": "rm -rf static\\css && mkdir -p static\\css"				<- for windows, need to esc the \ with a \


3. server.js

var express = require('express')
  , logger = require('morgan')
  , app = express()
  , template = require('jade').compileFile(__dirname + '/source/templates/homepage.jade')

app.use(logger('dev'))
app.use(express.static(__dirname + '/static'))

app.get('/', function (req, res, next) {
  try {
    var html = template({ title: 'Home' })
    res.send(html)
  } catch (e) {
    next(e)
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})

--- RECAP: so far all we have done is:
    ----------------------------------

nodejs-book/9-node-express-jade-sytlus$ tree -L 2       < 1. create root dir of proj
.
|-- Readme.txt
|-- node_modules	< 3. install ur dependent node modules     
|   |-- express
|   |-- jade
|   |-- morgan
|   |-- nodemon
|   `-- stylus
|-- package.json	< 2. $ npm init    creates the package.json file
`-- server.js		< 4. create server.js file


3. Add 

$ tree -L 2
.
|-- Readme.txt
|-- node_modules
|   |-- express
|   |-- jade
|   |-- morgan
|   |-- nodemon
|   `-- stylus
|-- package.json
|-- server.js
|-- source               <5. add source dir with
|   |-- stylesheets            ----------- stylus compiles *.styl files to gen css -----------
|   |   `-- index.styl    5.1 "build-css": "stylus source/stylesheets/index.styl -o static/css"
|   |                          *.styl -> stylus -> static/css
|   `-- templates
|       |-- default.jade
|       `-- homepage.jade


6. run it:

$ npm run watch

iadean@IADEAN-MOBL3 MINGW64 ~/Documents/2016/SWDEV/SW-Dev-Programming/js-node-npm-express/nodejs-book/9-node-express-jade-sytlus
$ npm run watch

> 9-node-express-jade-sytlus@1.0.0 watch C:\Users\iadean\Documents\2016\SWDEV\SW-Dev-Programming\js-node-npm-express\nodejs-book\9-node-express-jade-sytlus
> npm run clean && npm run watch-css & nodemon server -e js,jade


> 9-node-express-jade-sytlus@1.0.0 clean C:\Users\iadean\Documents\2016\SWDEV\SW-Dev-Programming\js-node-npm-express\nodejs-book\9-node-express-jade-sytlus
> rm -rf static\css && mkdir -p static\css


> 9-node-express-jade-sytlus@1.0.0 watch-css C:\Users\iadean\Documents\2016\SWDEV\SW-Dev-Programming\js-node-npm-express\nodejs-book\9-node-express-jade-sytlus
> stylus source/stylesheets/index.styl -o static/css -w

  watching C:/Users/iadean/Documents/2016/SWDEV/SW-Dev-Programming/js-node-npm-express/nodejs-book/9-node-express-jade-sytlus/node_modules/stylus/lib/functions/index.styl
  compiled static\css\index.css
  watching source/stylesheets/index.styl

??? hmm, no "Listening on http://localhost:3000" via console log ???

CTRL-C

6.1
iadean@IADEAN-MOBL3 MINGW64 ~/Documents/2016/SWDEV/SW-Dev-Programming/js-node-npm-express/nodejs-book/9-node-express-jade-sytlus
$ npm run start

> 9-node-express-jade-sytlus@1.0.0 start C:\Users\iadean\Documents\2016\SWDEV\SW-Dev-Programming\js-node-npm-express\nodejs-book\9-node-express-jade-sytlus
> node server

Listening on http://localhost:3000

6.2 browse to http://localhost:3000      works

nav bar    home   	ok
           news		?
           about	?
           contacts 	?


