const fs = require('fs');
const path = require('path');
const http = require('http');

const separator = path.sep;
const dir = __dirname;
const name_html_file = "index.html";
const path_html_file = dir + separator + name_html_file;
var html;
try{
	html = fs.readFileSync(path_html_file, 'utf8');
}catch(err){
	console.error(err);
}
const hostname = '127.0.0.1'; // http://localhost:3000/
const port = 3000;
const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html; charset=utf-8;");
	res.end(html);
	console.log(req.url);
});
server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});