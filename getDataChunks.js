// прочитати файл (отримав рядок в оперативку)
// рядок розділяю по \n і отримую масив рядків
// повторити наступну ф-ію для кожного посилання (запит і витягування заголовків)
//-----------------------
// взяти одне посилання і зробити запит на api
// витягти заголовки
// записати заголовки у файл
// -----------------------
// offset збільшувати на 60
const token = require('./token.js')
const fs = require('fs').promises
const fetch = require('node-fetch')
const sleep = require('util').promisify(setTimeout)
const fileName = './urlChunks.txt'
const path = './audi'
const offset = 1362

function request(url) {
    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/vnd.allegro.public.v1+json',
            Authorization: `Bearer ${token}`
        }
    }).then(resp => resp.json()).catch(() => request(url)) // добавився кетч
}

async function getDataChunks(fileName, request, path) {
    let urls = await fs.readFile(fileName, 'utf-8')
    urls = urls.split('\n')
    for (let i = offset; i < urls.length; i++) {
        await getDataChunk(request, urls[i], path, i)
    }
    return 'done'
}

async function getDataChunk(request, url, path, i) {
    const allNames = []
    let names, offset = 0
    do {
        await sleep(100)
        let data = await request(`${url}&offset=${offset}`)
        if(!data.items) { // обхід помилки з невалідним респонс
            // await sleep(1000)
            // data = await request(`${url}&offset=${offset}`)
            continue
        }
        names = data.items.regular.map(item => item.name)
        allNames.push(...names)
        offset += 60
    } while (names.length && offset <= 5940);
    const joinedNumbers = allNames.join('\n')
    await fs.writeFile(`${path}/${i}.txt`, joinedNumbers)
}

getDataChunks(fileName, request, path).then(console.log)
setTimeout(console.log, 1e8)