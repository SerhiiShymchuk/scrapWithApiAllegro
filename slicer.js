const fs = require('fs').promises
const pathForSaving = './mercedes/checkSnumbers/'
const pathForReading = './mercedes/processed/unique.txt'
// читаю файл 
// записую дані з оперативної памяті в масив
// ітеруюсь по масиву і після кожної двохсотої ітерації зберігаю результат у файл

slicer(pathForSaving, pathForReading)
async function slicer(pathForSaving, pathForReading) {
    const snumbers = await fs.readFile(pathForReading, 'utf8')
    const splittedSnumbers = snumbers.split('\n')
    for (let i = 0; i < splittedSnumbers.length; i+=200) {
        const slicedSnumbers = splittedSnumbers.slice(i, i+200)
        await fs.writeFile(pathForSaving+(i/200)+'.txt', slicedSnumbers.join('\n'), 'utf-8')
    }
}

