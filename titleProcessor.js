/*
прочитати папку -- це буде масив імен
відфільтрувати масив імен по текстовим файлам
масивом пройтися по кожному файлу
прочитати елемент масиву(текстовий файл)
застосувати регулярку для рядків
записати результати у папці процесд в якийсь файл текстовий
*/ 

const vendor = 'mercedes'
const pathTitles = `./${vendor}/`
const pathProcessed = `./${vendor}/processed/`
// const regExpAudiAndBosch = /\b\d\w\w\d{3}\d{3}[a-zA-Z]?[a-zA-Z]?\b|\d{10}/g //audi
//const regExpAudiAndBosch = /\b(\d{10,11}|\d{4}\w\d{5}|\d{6}-\d{4}|\d{7})\b/g //bmw
const regExpAudiAndBosch = /\b[aA]?\d{10}|\d{6}-\d{4}\b/g //mercedes
const fs = require('fs').promises

processTitles(pathTitles, pathProcessed, regExpAudiAndBosch)

async function processTitles(pathTitles, pathProcessed, regExp) {
    const fileNames = (await fs.readdir(pathTitles)).filter(name => name.endsWith('.txt'))
    for (let i = 0; i < fileNames.length; i++) {
        await processFile(fileNames[i],pathTitles, pathProcessed, regExp)
        console.log(i)
    }
}

async function processFile(fileName, pathTitles, pathProcessed, regExp) {
    const titles = await fs.readFile(pathTitles+fileName, 'utf-8')
    const snumbers = titles.match(regExp)?.join('\n') || ''
    //if (titles.match(regExp) == null) snumbers = ''
    await fs.writeFile(pathProcessed+fileName, snumbers)
}

