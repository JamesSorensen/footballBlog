
/* Started express */

const express = require('express')
const app = express()
const port = 3000

// EJS connection
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/* Started express*/



/* EJ template connection */

app.get('/', (req, res) => {
  res.render('index')
})

/* EJ template connection */



/* Send data */

app.get('/', (req, res) => {
  res.render('index', {data: data})
})

// <body>
//	<%= data %>
// </body> 

/* Send data */



/* Send data Get */

app.get('/create', (req, res) => {
  res.render('create')
})

// <a href="/create">Add</a>

/* Send data Get */



/* Send data Post */


/* Senda data Post */



/* Array Foreach */

const arr = ['hello', 'world', 'test'];

app.get('/', (req, res) => {
  res.render('index', { arr: arr })
})

/*

<ul>
  <% arr.forEach(function(item){ %>
    <li>
    	<%= item %>
    </li>
  <% }); %>
</ul>

*/

// Array push 

app.post('/create', (req, res) => {
	arr.push(req.body.text);
	res.redirect('/')
})

/* Array Foreach */

