// читаю папку з текстовими файлами
// створюю масив слів для фільтра blackList
// витягую рядки і записую в масив
// пробігаюсь по масиву рядків і фільтрую його на наявність елементів у blackList-у
// записати відфільтрований масив рядків у чистовий файл

import fs from 'fs/promises'

const vendor = 'ford'
const output = 'lines.txt'
const path = `./${vendor}/`
const blackList = ['TARCZA', 'TARCZE']

async function filterLines() {
    const files = await fs.readdir(path)
    const fileNames = files.filter(file => /^\d+\.txt$/.test(file))
    const fileContents = await Promise.all(fileNames.map(name => fs.readFile(path + name, 'utf-8')))
    const lines = fileContents.flatMap(content => content.split('\n'))
    const filteredLines = lines
        .filter(line => blackList.every(word => !line.toUpperCase().includes(word)))
    await fs.writeFile(path + output, filteredLines.join('\n'))
}

filterLines().then( () => console.log('done') )