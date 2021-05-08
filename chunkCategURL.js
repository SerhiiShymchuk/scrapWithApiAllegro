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
const car = 'renault'
const categoryID = '620'
const url = `https://api.allegro.pl/offers/listing?phrase=${car}&category.id=`
const min = 69
const max = 1800
const maxCount = 6000
const token = require('./token.js')
const sleep = require('util').promisify(setTimeout)
const fetch = require('node-fetch')
const fs = require('fs').promises
const path = `./${car}/`
const name = 'urlChunks.txt'
// блекліст
const catBlackList = ['261283', '254599', '254602','254603','254604','254605',
'254606','254608','254638','254600','250542','254643','254549','254552','254554',
'261284','250543','49236','261075','261086','261078','4136','18800','18798','255138',
'255139','50834','50835','255444','261132','255517','255518','261093','261136',
'50844','255478','261149','255479','50845','50846','255480','255481','261129','50843',
'147923','261130','261138','255506','147924','255508','261140','50856','50822',
'260943','255513','261141','255515','251085','260783','251125','251087','260785',
'251122','251124','18693','251127','18698','4142','258701','255609','50753','261065',
'50754','50752','261077','261563','50759','50760','50772','261085','50762','4147',
'260948','250843','250845','250846','250848','260949','260953','260951','258685',
'260955','258696','258689','50864','261089','255922','255919','18846','255930',
'255932','255924','261094','255928','261556','261557','261301','258688','258686',
'255640','255641','255642','255643','255644','258761','255645','255646','18863',
'250863','250864','250865','260723','260731','260726','260724','250869','250871',
'260728','250873','260730','250877','250878','250883','250884','260729','260722',
'256101','8687','261223','261225','254183','261224','254184','261226','254188','256104',
'261302','18886','250282','8682','256028','250222','252814','250302','250224','18893',
'18895','256105','250242','256032','250285','256034','18900','18901','4132','8695','629']

function request(url) {
    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/vnd.allegro.public.v1+json',
            Authorization: `Bearer ${token}`
        }
    }).then(resp => resp.json()).then(filterCategories)
}

function filterCategories(answer) {
    catBlackList.forEach(delcat => {
        answer.categories.subcategories = answer.categories.subcategories.filter(subCat => subCat.id != delcat)
    })
    return answer
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
            if (avg == min || avg == max ) {
                urlChunks.push(fullUrl)
                return
            }
            console.log(avg)
            await sleep(80)
            await splitChunk(request, url, categoryID, min, avg, urlChunks)
            await sleep(80)
            await splitChunk(request, url, categoryID, avg, max, urlChunks)
        }
    } else {
        urlChunks.push(fullUrl)
        console.log(fullUrl)
    }
}

chunkCategoryUrl(request, url, categoryID, min, max).then(urlChunks => fs.writeFile(path+name, urlChunks.join('\n')))
//setTimeout(console.log, 1e8)