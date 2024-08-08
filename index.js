const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const {API_PORT} = process.env;
const port = API_PORT;
//console.log(API_PORT);
// console.log(process.env)

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});