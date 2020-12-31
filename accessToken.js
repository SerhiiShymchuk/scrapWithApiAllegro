const fetch = require('node-fetch')
const fs = require('fs').promises
const {clientID, clientSecret} = require('./secret.js')
const url = 'https://allegro.pl/auth/oauth/token?grant_type=client_credentials'

// кодування в base64
function toBase64(str) {
    const buff = Buffer.from(str);
    const base64data = buff.toString('base64')
    return base64data
}

//отримання токену
async function getToken(url, clientID, clientSecret) {
    const responseObj = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: 'Basic ' + toBase64(clientID + ':' + clientSecret)
        }
    })
    .then(response => response.json())
    return responseObj.access_token 
}

getToken(url, clientID, clientSecret).then(data => 
    fs.writeFile('./token.js', `module.exports = '${data}'`, 'utf-8')).then(console.log())