var express = require('express')
  , logger = require('morgan')
  , app = express()
  , bodyParser = require('body-parser')
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
    var html = template1({ title: 'Home' })
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

app.get('/about', function (req, res, next) {
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

app.get('/checkbox', function (req, res, next) {
  try {
    var html = template5({ title: 'Check Box Forms' })
    res.send(html)
  } catch (e) {
    next(e)
  }
})

app.post('/relays', function(req, res) {
  
	console.log('posted form data : ', 
		    req.body.chkbox1,
		    req.body.chkbox2,
		    req.body.duration
		    );

})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})

