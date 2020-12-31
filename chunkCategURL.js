// вибрати категорію для пошуку
// визначити фразу для пошуку
// створити масив для робочих запитів(<6000 елементів у відповіді)
//------------
// зробити запит від мінімальної (50) до максимальної ціни (2000)
// визначити кількість елементів (totalCount)
// якщо totalCount<6000 додаємо цей запит у робочі
// інакше визначаємо середню ціну між мінімальною і максимальною
// робимо 2 запити на відповідні проміжки (min<середина<max)
// робмио рекурсію для повтору операцій
const car = 'audi'
const categoryID = '620'
const url = `https://api.allegro.pl/offers/listing?phrase=${car}&category.id=`
const min = 50
const max = 2000
const maxCount = 6000
const token = require('./token.js')
const sleep = require('util').promisify(setTimeout)
const fetch = require('node-fetch')
const fs = require('fs').promises
const path = './'
const name = 'urlChunks.txt'

function request(url) {
    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/vnd.allegro.public.v1+json',
            Authorization: `Bearer ${token}`
        }
    }).then(resp => resp.json())
}

async function chunkCategoryUrl(request, url, categoryID, min, max) {
    const urlChunks = []
    await splitChunk(request, url, categoryID, min, max, urlChunks)
    return urlChunks
}

async function splitChunk(request, url, categoryID, min, max, urlChunks) {
    const fullUrl = `${url}${categoryID}&price.from=${min}&price.to=${max}` 
    const answer = await request(fullUrl)
    if (answer.searchMeta.totalCount > maxCount) {
        if (answer.categories.subcategories[0].id != answer.categories.path.pop().id) {
            for (const subcategory of answer.categories.subcategories) {
                await splitChunk(request, url, subcategory.id, min, max, urlChunks)
            }
        } else {
            const avg = +((max+min)/2).toFixed(2)
            console.log(avg)
            await sleep(100)
            await splitChunk(request, url, categoryID, min, avg, urlChunks)
            await sleep(100)
            await splitChunk(request, url, categoryID, avg, max, urlChunks)
        }
    } else {
        urlChunks.push(fullUrl)
        console.log(fullUrl)
    }
}

chunkCategoryUrl(request, url, categoryID, min, max).then(urlChunks => fs.writeFile(path+name, urlChunks.join('\n')))
//setTimeout(console.log, 1e8)