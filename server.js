/*****************************************************************************
Remote Relay Control using NODEJS 
This module can be used to remote control relay cards over the network.
It has numerous applications in automation applications.

Ex: Any IA32 platforms: (ex: Edison, SBC, Tablet, Netbook, Chromebook, Notebook,
 Server) that can run Linux and has USB ports for hooking up a usb-relay08 card or
 has I2C support (ex: Edison) for connecting to a i2c-gpio -to- gpio Relay card

Client PC     wired     Embedded PC <----usb------> USB-RELAY08 Card
            <-- OR -->
Client PC    wireless   Embedded PC <-i2c_to_gpio-> Arduino Relay Card
              network

This example is using build scripts in npm package.json

TO build:  $ npm run clean
           $ npm run build-css
TO run:    $ npm run start           <- this starts the express server 
                                        on port 3000 of localhost
Access URL: localhost:3000

******************************************************************************/

var express = require('express')
  , logger = require('morgan')
  , app = express()
  , bodyParser = require('body-parser')
  , fs = require('fs')
  , template1 = require('jade').compileFile(__dirname + '/source/templates/homepage.jade')
  , template2 = require('jade').compileFile(__dirname + '/source/templates/newspage.jade')
  , template3 = require('jade').compileFile(__dirname + '/source/templates/forms1.jade')
  , template4 = require('jade').compileFile(__dirname + '/source/templates/forms.jade')
  , template5 = require('jade').compileFile(__dirname + '/source/templates/forms2.jade')

app.use(logger('dev'))
app.use(express.static(__dirname + '/static'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res, next) {
  try {
    var html = template1({ title: 'REMOTE RELAY CONTROL WITH NODEJS' })
    res.send(html)
  } catch (e) {
    next(e)
  }
})

app.get('/textbox', function (req, res, next) {
  try {
    var html = template3({ title: 'Text Box Forms' })
    res.send(html)
  } catch (e) {
    next(e)
  }
})

app.get('/forms', function (req, res, next) {
  try {
    var html = template4({ title: 'Forms' })
    res.send(html)
  } catch (e) {
    next(e)
  }
})

app.post('/signup', function(req, res, next) {
  
	console.log('posted form data : ', 
		    req.body.firstname, 
		    req.body.lastname,
		    req.body.email,
		    req.body.username,
		    req.body.password
		    );

})

app.get('/relaytest', function (req, res, next) {
/*

rs.json

  {"card":[{"r1":"0","r2":"1","r3":"1","r4":"","r5":"","r6":"","r7":"","r8":""}]}

PLAN B: 
rs1Str < read relay state file (rs.json)  
rs1Obj < JSON.parse(rs1Str)
pass template file resulting rs1Obj
update template file to set present state from rsObj
*/

  var rs1Obj = JSON.parse(fs.readFileSync('rs.json', 'utf8'));
  console.log('rs1Obj : ', rs1Obj);

  try {  // assume we can pass json objects vs json strings to jade templates
      var html = template5({ title: 'Relay Test', rs1Obj })
    res.send(html)
  } catch (e) {
    next(e)
  }

})

/* 20160703 show example of how to process json msg sent from postman
            instead of a post coming from a form submit button

app.post('/relays', function(req, res) {
	var postBody = req.body;
	console.log('postBody : ', req.body);
	console.log('r1 state duration : ', req.body.r1, req.body.r1dur);
	console.log('r2 state duration : ', req.body.r2, req.body.r2dur);
	console.log('r3 state duration : ', req.body.r3, req.body.r3dur);

	var rsObj = getRelayPSArray(postBody);
	console.log('JSON.stringify(rsObj) : ', JSON.stringify(rsObj));

	console.log('writing rs.json file...');
	fs.writeFileSync('rs.json', JSON.stringify(rsObj));

	// rs.json
        // {"card":[{"r1":"0","r2":"1","r3":"1","r4":"","r5":"","r6":"","r7":"","r8":""}]}
	//

	res.redirect('/relaytest')
})
*/

// 20160703 As an example, redo app.post() to process json msg sent from postman
// 1. INPUT FROM POSTMAN
//    URL:  localhost:3000/relays
//    POST>BODY>raw>JSON(application/json)
//    {"card":[{"r1":"0","r2":"1","r3":"1","r4":"","r5":"","r6":"","r7":"","r8":""}]}
// 1.1 Send

// NOTE: In Postman - you have to enter a JSON String and not a JSON object otherwise
//                    postman will tell you it's an BAD STRING
//
//    JSON String - both key:value quoted
//    OK:
//    {"card":[{"r1":"0","r2":"1","r3":"1","r4":"","r5":"","r6":"","r7":"","r8":""}]}
//
//    JSON Object - key un-quoted, value quoted
//    BAD STRING:
//    { card:[ { r1: '' , r2: '', r3: '', r4: '' , r5: '', r6: '' , r7: '', r8: ''}


app.post('/relays', function(req,res) {
    var postBody = req.body;
    console.log('rcvd : ', req.body);
    res.send('message recieved');

// 2. In Console Log See: 
// rcvd :  { card: [ { r1: '0', r2: '1', r3: '1', r4: '', r5: '', r6: '', r7: '', r8: '' } ] }
// POST /relays 200 1.633 ms - 16

// NOTE: req.body ends up being a parsed json object and not a json string
//       so, if you post a json string, you rcv a parsed json object

})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})

// function to convert radiobox inputs to relay state (rs.json) file format

// rs.json file holds just the Value part of the relayAction[] array

//  relayAction[ {RelayNumber,    Value,          Duration}, 
//               {       ...repeat for ea relay...        },
//               {RelayNumber,    Value,          Duration} ]
 
//                  1..N          '' undefined     -1  no duration, just on or off
//                                0  "0"           0-n Secs, apply value for n secs
//                                1  "1"
//                     rs.json ___|   |               
//                                    radioBox form POST inputs

// changed the jade template for the radioBox to return '0' and '1' 
//                                           instead 'off' and 'on', 
// to reduce lookup from a longer switch/case to a shorter if/else

function findRlyState(radioBoxIn){
    var relayState = '';
    if (radioBoxIn === undefined) {
	relayState = '';
    } else {
	relayState = radioBoxIn;
    }
    return relayState;
}

// Function to convert post data inputs from radiobox form function into a javascript ojbect
// Input: postBody
// Output: rsObj 
 
	/*
	  

	  >> javascript array's are an ordered ( zero-base index) data type
	  arrays have push, pop, splice, insert methods for manipulating

	  >> javascript objects are unordered (key->value index) data type

	  >> json = JavaScript Object Notation (JSON) used represent javascript objects

	  what we got now :
          
	  rps[] :  [ '',  '1',   '1',  '1',   '', '', '', '',  ''  ]
	  rps[0] rps[1] rps[2] rps[3] ...            rps[8]

	  what we need is:

	  { rps : [ { r1:rps[1], r2:rps[2], r3:rps[3], ... r8:rps[8]} ] }

	  simplest way to do this would be to define the js obj with all the values = ''
	  then assign the applicable values based on the postBody data that gets POSTED
	  from form2.jade

	 */

function getRelayPSArray(postBody) {

    console.log ("Entering getRelayPSArray(postBody) with ...");
    console.log ("postBody : ", postBody);
    console.log ("postBody.r1 ", postBody.r1, typeof(postBody.r1));
    console.log ("postBody.r2 ", postBody.r2, typeof(postBody.r2));
    console.log ("postBody.r3 ", postBody.r3, typeof(postBody.r3));

    // rs - relay state of ea relay card in the system, ea card can have multiple relays on it
    //      a js obj = unordered data type of key:value pairs
    //        js obj can be converted to json strings for xfr & storage using JSON.stringify()
  
    var rs = { card:[ { r1: '' , r2: '', r3: '', r4: '' , r5: '', r6: '' , r7: '', r8: ''} // rs.card[0].r1 - rs.card[0].r8
		    //{ r1: '' , r2: '', r3: '', r4: ''                                  }    rs.card[1].r1 - rs.card[1].r4
                    //{                                                                  }    etc 
                    ] 
             };

    // explicitly check the state of each relay defined in the radiobox inputs in forms2.jade

    //When comparing a string with a number, JavaScript will convert the string to a number when doing the comparison. 
    //An empty string converts to 0. 
    //A non-numeric string converts to NaN which is always false.

    // === equal value & type
    // !== not equal value & type

    // ==  equal to
    // !=  not equal to

    if (postBody.r1 !== undefined){
	rs.card[0].r1 = postBody.r1;
    } //else it's already UNDEFINED via rs initial state

    if (postBody.r2 !== undefined){
	rs.card[0].r2 = postBody.r2;
    }

    if (postBody.r3 !== undefined){
	rs.card[0].r3 = postBody.r3;
    }

    console.log("Exiting getRelayPSArray(postBody) with ... ");
    console.log("relay state : ", rs);

    //TODO expand as needed based on number of relays on the relay card

    return rs;
}



