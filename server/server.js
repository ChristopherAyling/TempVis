const express = require('express');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({
	dev
});

const handle = app.getRequestHandler();

app.prepare()
	.then(() => {
        const server = express();
        const server2 = require('http').createServer(server)
        const io = require('socket.io')(server2)


		server.use(express.static('public')) // serve static files

        // ====== Our Routes Here

        server.get('/hook', (req, res) => {
            io.sockets.emit('hello_world', 'hello, world') 
            res.json({ status: "ok" })
        })

        // ======

        server.get('/test', (req, res) => { // is alive
            res.send("test complete")
		})

		server.all('*', (req, res) => { // redirect everything else to next.js (pages directory)
			return handle(req, res);
		});

		server2.listen(port, err => {
			if (err) {
				throw err;
			}
			console.log(`> Ready on http://0.0.0.0:${port} [${process.env.NODE_ENV || 'dev'}]`);
		});
	})
	.catch(error => {
		console.log(error.stack);
		process.exit(1);
	});