const express = require('express');
const next = require('next');
const fetch = require('node-fetch');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({
	dev
});

const sendSMS = (message) => {
    console.log("messaging...")
    const api_key = "3f35dc39"
    const api_secret = "b6a87798ae15ef870dad9d94e7040e76"
    const phone_number = "61401842463"

    const method = "POST"
    const params = "?api_secret="+api_secret
    const url = "https://api.apidaze.io/"+api_key+"/sms/send"+params
    const headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    const payload = "number="+phone_number+"&subject=tempCheck&body="+message.replace(/ /g,"%20")

    fetch(url, {
        method: method,
        headers: headers,
        body: payload,
    })
    .then(response => {
        console.log(response.json());
    })
}

let lastSMS = null

const thresh = 20

const handle = app.getRequestHandler();

let step = 1

let oldTemp = thresh

app.prepare()
	.then(() => {
        const server = express();
        const server2 = require('http').createServer(server)
        const io = require('socket.io')(server2)

		server.use(express.static('public')) // serve static files

        // ====== Our Routes Here

        server.all('/newTemps', (req, res) => {
		console.log(req)
console.log(req.body)
            let data = [
                // {time: 4, c0: Math.random()*30+10, c1: Math.random()*30+10, c2: Math.random()*30+10, c3: Math.random()*30+10, c4: Math.random()*30+10},
                {time: step, c0: parseFloat(req.query.temp)}
            ]
            step++
            io.sockets.emit('update', data)
            res.json({ status: "ok" })
            if (data[0]["c0"] > thresh && oldTemp < thresh) {
                sendSMS("the temperature is over the threshold ("+thresh+"°C)")
            } else if (data[0]["c0"] < thresh && oldTemp > thresh) {
                sendSMS("the temperature is now below the threshold ("+thresh+"°C)")  
            }
            oldTemp = data[0]["c0"]
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
