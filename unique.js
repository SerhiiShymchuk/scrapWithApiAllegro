/*
прочитати папку з файлами
зєднати вміст файлів в один
зробити порізати по бекслешах
зробити унікалізацію
записати результат у новий файл
*/
const vendor = 'audi'
const fileName = 'unique.txt'
const pathProcessed = `./${vendor}/processed/`
const fs = require('fs').promises

unique(pathProcessed, fileName).then(() => console.log('done'))

async function unique(path, fileName) {
    const fileNames = await fs.readdir(path)
    const files = await Promise.all(fileNames.map(fileName => fs.readFile(path+fileName, 'utf-8'))) // дочекатиcя всіх промісів
    const snumbers = files.join('\n').toUpperCase().split('\n')
    console.log(snumbers.length)
    const set = new Set(snumbers)
    const uniqueNumbers = [...set].join('\n')
    await fs.writeFile(path+fileName, uniqueNumbers, 'utf-8')
    fileNames.forEach(fileName => fs.unlink(path+fileName))
}
