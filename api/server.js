/*
	Api tutorials: https://scotch.io/@gilles/get-started-with-creating-a-restful-api-endpoints-in-nodejs-and-expressjs#toc-postman
*/

const http = require('http');
const request = require('./request');

const port = process.env.PORT || 3120;
const server = http.createServer(request);

server.listen(port, () => {
    //    let's print a message when the server run successfully
    console.log("Server restarted successfully")
});