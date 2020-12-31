// прочитати папку
// створити масив назв файлів
// проходжуся по масиву і читаю файли
// записати вміст з оперативки в файл urlChunks.txt
const fs = require('fs').promises
const path = './urls/'
joinUrls(path)
async function joinUrls(path) {
    const fileNames = await fs.readdir(path, 'utf-8')
    let urls = await Promise.all(fileNames.map(name => fs.readFile(path+name, 'utf-8'))) //масив вмісту файлів
    const str = urls.join('\n')
    await fs.writeFile(path+'urlChunks.txt', str, 'utf-8')
    
    for (let i = 0; i < fileNames.length; i++) {
        await fs.unlink(path+fileNames[i]) //видаляю файли
    }
}



