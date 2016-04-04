Recap:

install node/express/jade/stylus boiler plate UI front end

update template to add pages
 About   > Forms - jade template for all kinds of forms
 TextBox > TextBox Form & code to capture inputs from submit button post
 CheckBox > Checkbox Form & code to captue inputs using submit button post

TODO:
- create page with Forms to capture ButtonAction[] array 

  ButtonAction[{"Relay" : ___   , "Value" : ___  ,  "Duration" : ___ }, { }, { },...{ }]

                         1-N_relay          0                    -1
                                            1			 1-N_sec
                                           ''
                         Label

----

           State        Duration
          On   Off
Relay #   [ ]  [ ]      Selects  \__ one of N choices
\_ inline chkbox _/     dropdown /   -1 1 2 3 4 5 6 7

          On   Off     - checkbox inputs -     Value
Relay #   [ ]  [ ]     undefined undefined      ''
          [x]  [ ]        on     undefined      1
          [ ]  [x]     undefined     on         0

          [x]  [x]     --- not allowed ----
                       but user can make this sel


---- above is stupid ----  
setup html radio form to only allow selection of 1 of the 2 states
          On   Off    req.body.r1  Value
Relay #   ( )  ( )    undefined     ''
          (*)  ( )    on            1
          ( )  (*)    off           0

          (*)  (*)    -- cant be selected ---     

-----------------   req.body.rN	 Duration
r1 state duration :  undefined	-1
r2 state duration :  on        	-1
r3 state duration :  undefined 	-1

r1 state duration :  on 	-1
r2 state duration :  off 	-1
r3 state duration :  undefined 	-1


--- How to test for undefined -----

var x;

if (x === undefined) {
    txt = "x is undefined";
} else {
    txt = "x is defined";
}
---------------

block content
  form(action='/relays', method='POST')
    .row
      .col-xs-6
        form(role="form")
          .form-group                ___ both radio buttons have the same name, so only 1 of the 2 can be selected
            label Relay 1           /                                              or niether one (both unselected)
              input(type="radio", name="r1", value="on")
              |  On                            \__________ both radio buttons have value that
              input(type="radio", name='r1', value="off")  will be posted when submit button is pressed
              |  Off                                       
            label Duration 
            select(id="dur123" name="r1dur")
              option -1
              option 1
              option 2
              option 3
              option 4
              option 5
          input.btn.btn-primary(type="submit", value='Relays')

with a node/express server using the bodyParser package, this is how u can get at the data the gets posted from
the form above:

app.post('/relays', function(req, res) {
  
	console.log('r1 state duration : ', 
		    req.body.r1,             // r1   :  on  off  or   undefined
		    req.body.r1dur           // r1dur:  -1 <- if not selected, otherwise the selected option
		    );

})


--- ok, now how can we display the current state of relays when the form gets rendered ----

http://stackoverflow.com/questions/9931531/jade-template-with-variables-nodejs-server-side

Yes you can do that when you call render pass the object with data

res.render('your page', {pageData: {name : ['name 1', 'name 2']}});
Then inside jade you can do

span #{pageData.name[0]}
or if you want a loop

each item in pageData.name
  span #{item}
You can find more on the github page https://github.com/visionmedia/jade

--- update server.js to use ---

http://expressjs.com/en/guide/using-template-engines.html

app.get('/', function (req, res, ?next?) {
    res.render('ur_page', {title: 'Hey', message: 'Hello there!'})
});                          |              |
                             |              |
			     |		    |   title & message r local variables that get
html			     |		    |   feed to the jade template before it's rendered
  head			     |		    |
    title= title  <----------/		    |
  body					    |
    h1= message   <-------------------------/


>> the 'simple node/express/jade/sytlus' website app (server.js) isn't using
   res.render() instead its using the following syntax:

var template5 = require('jade').compileFile(__dirname + '/source/templates/forms2.jade')
...
app.get('/checkbox', function (req, res, next) {
  try {
    var html = template5({ title: 'Check Box Forms' })
    res.send(html)
  } catch (e) {
    next(e)
  }
})
 
where  title   is passed to default.jade which is included in template for ea page

doctype html
html
  head
    link(rel='stylesheet', href='/css/index.css')
    title World Wide Web
  body
    .header
      h1.page-title #{title}          <----  #{title}  vs  title= title

------
http://jaspreetchahal.org/expressjs-exposing-variables-and-session-to-jade-templates/

http://jade-lang.com/tutorial/
------

http://stackoverflow.com/questions/13624650/jade-radio-button-checked-condition

You can do this in jade even simpler than in PHP:

input(type="radio", name="gender_filter", value="1", checked=gender=="male")
| Male
input(type="radio", name="gender_filter", value="0", checked=gender=="female")
| Female
This code block expects gender to be a variable passed from the backend to the view.

 res.render('ur_page', { gender: 'male'})         gender_filter   (*)Male  ( )Female
 res.render('ur_page', { gender: 'female'})       gender_filter   ( )Male  (*)Female
 res.render('ur_page', { gender: ''})             gender_filter   ( )Male  ( )Female
















REF: usb-relay08.js
-------------------
/********************************************************************************
From DMS Logs:

ButtonActionArray[] 
-------------------
This message is delivered to DMS from UI/BLL by activating the following 3 routes:

CASE1:  Device Provison

DMS-0 btnAction[] :  [
        { buttonNumber: 1, value: '0', duration: -1 },
DMS-0   { buttonNumber: 2, value: '0', duration: -1 },
DMS-0   { buttonNumber: 3, value: '0', duration: -1 },
        ...
DMS-0   { buttonNumber: 16, value: '', duration: -1 } ]
                        ^          ^              ^
                       Num        null           Num

CASE2: GUI Button Press

DMS-1 btnAction[] :  [
        { buttonNumber: '1', value: '1', duration: '1' } ]
                         ^           ^              ^
                        String      String        String

       TODO: File Bug to Fix UI ISSUE:  
       No error checking of user input on the UI   '1 sec'
       so the duration can be anything the user    'Charle Foxtrot'
       inputs                                      'blah blah'

                                                      
CASE3: Unprovision

DMS-2 btnAction[] :  [
        { buttonNumber: 1, value: '0', duration: -1 },
DMS-2   { buttonNumber: 2, value: '0', duration: -1 },
DMS-2   { buttonNumber: 3, value: '0', duration: -1 },
        ...
DMS-2   { buttonNumber: 16, value: '', duration: -1 }
                        ^          ^              ^
                       Num        String         Num

Number(x) - function converts the object argument to a number that represents the object's value

INTERPRET buttonAction[] array:

        buttonNubmer        value            duration

type    Num                 Num or null      Num

values  1-16 Relay Number   '0' Off          -1
                            '1' On           '0' to 'N'   Seconds
                            ''  do nothing

************************************************************************/
