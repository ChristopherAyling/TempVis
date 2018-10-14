const express = require('express');
const next = require('next');
const fetch = require('node-fetch');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({
	dev
});

const sendSMS = (message) => {
    // stuff here
}

let lastSMS = null

const thresh = 100

const handle = app.getRequestHandler();

let step = 1

app.prepare()
	.then(() => {
        const server = express();
        const server2 = require('http').createServer(server)
        const io = require('socket.io')(server2)

		server.use(express.static('public')) // serve static files

        // ====== Our Routes Here

        server.get('/newTemps', (req, res) => {
            let data = [
                // {time: 4, c0: Math.random()*30+10, c1: Math.random()*30+10, c2: Math.random()*30+10, c3: Math.random()*30+10, c4: Math.random()*30+10},
                {time: step, c0: Math.random()*30+10}
            ]
            step++
            io.sockets.emit('update', data)
            res.json({ status: "ok" })

            if ((data > thresh)) {
                sendSMS("the data is over the threshold")
            }
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
