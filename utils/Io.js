const fs= require('fs')
class Io {
    #dir
    constructor ( dir ) {
        this.#dir=dir
    }
    async read() {
        return await JSON.parse(await fs.promises.readFile(this.#dir, 'utf8'))
    }
    async write( data ) {
        fs.promises.writeFile(this.#dir, JSON.stringify(data, null, 4), 'utf8')
     }
}
module.exports=Io