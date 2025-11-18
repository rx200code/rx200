const fs = require('fs');
const path = require('path');
const http = require('http');

const separator = path.sep;
const hostname = '127.0.0.1'; // http://localhost:3000/
const port = 3000;
const server = http.createServer((req, res) => {
	let html;
	const path_html_file = __dirname + separator + (req.url.replace(/^\/([\?]*)/, "$1").replaceAll("/", separator) || "index.html");
	console.log(path_html_file);
	try{
		html = fs.readFileSync(path_html_file);
	}catch(err){
		html = "" + err;
	}
	res.statusCode = 200;
	res.end(html);
});
server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});