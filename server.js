require('./config/db');
// require('./authentication/config/passportConfig');

const express = require('express');
const cors = require('cors');
// const passport = require('passport');
const routes = require('./routes');
const utilsFunctions = require('./config/helperFunctions');

const app = express();

// middleware
app.use(express.json(), express.urlencoded({extended: true}));
app.use(cors());
// app.use(passport.initialize());

// refer to the file './index.router.js' in root directory of the mongo-server
app.use('/api/v1/', routes);

app.use(function(err, req, res, next) {
    utilsFunctions.serverErrorHandler(err, req, res, next);
});

const port = 4545;

// const server = app.listen(port, '127.0.0.1', () => {
//     console.log(`server is live on port ${port}`);
//     // console.log('generic date value!!! you are welcome!', Date.now());
// });

// module.exports.app = express();
