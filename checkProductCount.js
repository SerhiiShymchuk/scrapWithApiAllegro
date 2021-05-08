const token = require('./token.js')
const fetch = require('node-fetch')
const fs = require('fs').promises
const sleep = require('util').promisify(setTimeout)
// шлях для обробки файлу
const pathForCheck = './mercedes/checkSnumbers/'

// прочитати з ориг номерами
// пройтися циклом і на кожен рядок зробити запит в апішку
// записати кількість знайдених товарів (з опцією  fallback=false) після оригінального номера =totalCount
// записати результати у файл

checkCountProduct(request, pathForCheck)

function request(url) {
    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/vnd.allegro.public.v1+json',
            Authorization: `Bearer ${token}`
        }
    }).then(resp => resp.json())
}

async function checkCountProduct(request, path) {
    let filenames = await fs.readdir(path, 'utf-8')
    filenames = filenames.filter(name => name != 'counted')
    filenames = filenames.map(name => name.replace('.txt', '')).sort((a,b) => a-b).map(name => name+'.txt')
    for (let k = 302; k <= filenames.length-1; k++) {
                
        const sNumbers = await fs.readFile(path+filenames[k], 'utf-8')
        const arrayOfNumbers = sNumbers.split(/\r?\n/g)
        let arrayOfNumbersWithCount = []
        for (let i = 0; i < arrayOfNumbers.length; i++) {
            await sleep(75)
            const responce = await request(`https://api.allegro.pl/offers/listing?category.id=620&phrase=${arrayOfNumbers[i]}&fallback=false`)
            if (!responce.searchMeta) {
                await sleep(200)
                i--
                continue
            }
            const totalCount = responce.searchMeta.totalCount
            arrayOfNumbersWithCount.push(arrayOfNumbers[i] + '=' + totalCount)
            console.log(arrayOfNumbers[i] + '=' + totalCount)
        }
        fs.writeFile(path+'counted/'+filenames[k], arrayOfNumbersWithCount.join('\n'), 'utf-8')
        console.log(k)
    }
}
