const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const {isFile, isWavFile, inputExtensionName, outputExtensionName} = require('./utils')

function convertWavToMp3(filename) {
    return new Promise((resolve, reject) => {
        if (!isWavFile(filename)) throw new Error('This file is not a wav file.')

        const outputFile = filename.replace(inputExtensionName, outputExtensionName)

        ffmpeg({source: filename})
            .on("error", (err) => {
                reject(err)
            })
            .on("end", () => {
                resolve(outputFile)
            })
            .save(outputFile)
    })
}

function convert(mainDir) {
    if (!mainDir) throw new Error('Required 1 argument but got 0.')

    fs.readdir(mainDir, (err, result) => {
        if (err) throw new Error(err.message)
        result.forEach(async (filename) => {
            const filepath = `${mainDir}/${filename}`
            if (isFile(filepath)) {
                await convertWavToMp3(filepath)
            }
            else {
                convert(filepath)
            }
        })
    })
}


module.exports = {
    convert,
    convertWavToMp3
}