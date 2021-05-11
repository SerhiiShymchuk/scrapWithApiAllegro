// читаю файл
// записую вміст у масив
// перебираю масив і в кожному елементі шукаю тільки ті що =9 і більше
// записую фільтрований масив у рядок, а рядок у файл
const fs = require('fs').promises
//const pathForReading = './audi/checkSnumbers/counted/'
const pathForReading = './renault/checkSnumbers/counted/'
const fileNameForReading = 'joined.txt'
const fileNameForSaving = 'filteredNumbers.txt'
const regExpFilter = /.+(?==(\d\d|8|9))/g // =8 і більше

filterSNumbers(pathForReading, fileNameForReading, fileNameForSaving, regExpFilter)

async function filterSNumbers(path, fileRead, fileSave, regExp) {
    const snumbers = await fs.readFile(path+fileRead, 'utf-8')
    const filteredSnumbers = snumbers.match(regExp)
    const numbers = filteredSnumbers.join('\n')
    await fs.writeFile(path+fileSave, numbers)
    console.log('завершено')
}
