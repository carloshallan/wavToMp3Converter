const fs = require('fs')
const path = require('path')
const {convertWavToMp3, splitAudioOnSilence} = require('./convert')
const {isFile, replaceExtensionToMp3} = require('./utils')
const argv = process.argv
const directory_to_convert = argv[2]
const prefix = argv[3]

function run(mainDir, newPrefix) {
    if (!mainDir) throw new Error('Required 1 argument but got a 0.')
    fs.readdir(mainDir, (error, result) => {
        if (error) throw new Error(error.message)

        result.forEach(async (filename, index) => {
            const filepath = path.join(mainDir, filename)

            if (!filepath.includes('.DS_Store'))
                if (isFile(filepath)) {
                    if (prefix) {
                        let ext = path.extname(filepath)

                        if (!ext) ext = '.wav'
                        const newFilepath = path.join(mainDir, `${newPrefix}-${index + 1}${ext}`)

                        await fs.promises.rename(filepath, newFilepath)
                        const mp3File = await convertWavToMp3(newFilepath)

                        const outputDir = path.join(path.dirname(mp3File), 'output')

                        if (!fs.existsSync(outputDir)) await fs.mkdirSync(outputDir)
                        await splitAudioOnSilence(mp3File, outputDir)

                    }
                    await convertWavToMp3(filepath)
                } else {
                    run(filepath, newPrefix)
                }
        })
    })
}

run(directory_to_convert, prefix)

module.exports = {
    run,
}