const mongoose = require('mongoose');

//opens a connection to the reviewsDB database on our locally running instace of MongoDB
mongoose.connect('mongodb://localhost/reviewsDB', {
  useUnifiedTopology: true,
  useNewUrlParser:true});

mongoose.connection
//notifies on connection error
.on('error', function(error){
  console.log('Connection error: ', error)
})
//notifies on successful connection
.once('open', function() {
  console.log('connection has been made');
})


