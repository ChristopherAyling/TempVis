const fetch = require('node-fetch');

const api_key = "3f35dc39"
const api_secret = "b6a87798ae15ef870dad9d94e7040e76"
const phone_number = "61401842463"
const num_dict = {"61401842463":"Kai", "61490201227":"Noah"}

const method = "POST"
const params = "?api_secret="+api_secret
const url = "https://api.apidaze.io/"+api_key+"/sms/send"+params
const headers = {'Content-Type': 'application/x-www-form-urlencoded'}
const payload = "number="+phone_number+"&subject=Hello&body=Hey%20"+num_dict[phone_number]

fetch(url, {
    method: method,
    headers: headers,
    body: payload,
})
.then(response => {
    console.log(response.json());
})