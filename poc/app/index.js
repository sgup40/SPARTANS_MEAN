var connect = require('connect'),
	serveStatic = require('serve-static'),
	app = connect();


app.use(serveStatic('../public'));

app.listen(9999);