// прочитати папку
// перебрати масив і зберегти вміст всіх файлів в 1 файл
const fs = require('fs').promises
//const pathForReading = './audi/checkSnumbers/counted/'
const pathForReading = './mercedes/checkSnumbers/counted/'
const fileNameForSaving = 'joined.txt'

joiner(pathForReading, fileNameForSaving)
async function joiner(path, filename) {
    const fileNames = await fs.readdir(path, 'utf-8')
    let snumbers = []
    for (let i = 0; i < fileNames.length; i++) {
        const lines = (await fs.readFile(path+fileNames[i], 'utf-8')).split('\n')
        snumbers.push(...lines)
        console.log(snumbers.length)
    }
    const fileContent = snumbers.join('\n')
    console.log(fileContent.length)
    fs.writeFile(path+filename, fileContent, 'utf-8')
}