/*
https://stackoverflow.com/questions/36002413/conventions-for-app-js-index-js-and-server-js-in-node-js
Naming conventions on entry points of applications:
index.js - npm init sets the main entry point of the module to index.js
server.js - if no start script is supplied, npm start will by default run "node server.js"
app.js - some IDEs (integrated development environment) such as VS Code will default to app.js as the entry point of a program you debug

*/

const express = require('express');
const routes = require('./routes.js');
const app = express();
/*
https://expressjs.com/en/guide/routing.html
Use the express.Router class to create modular, mountable route handlers.
A Router instance is a complete middleware and routing system;
for this reason, it is often referred to as a “mini-app”.
*/

const port = 3000;



/*configures client which attaches to statsD daemon*/
//default port to send stats to is 8125
// const StatsD = require('node-statsd');
// const client = new StatsD({
//   "prefix":"coolNew_"
// })

// app.get('/', (req, res) => {
//   client.increment('new_root_request');
//   console.log("sent")
//   res.send('Hello World');
// })
/*****/


app.use(express.json());
app.use('/', routes);


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});


