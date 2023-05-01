const fs = require('fs')
const path = require('path')

const inputExtensionName = '.wav'
const outputExtensionName = '.mp3'


function isWavFile(filename) {
    const ext = path.extname(filename)
    return ext === inputExtensionName
}

function isFile(filepath) {
    return fs.statSync(filepath).isFile()
}

function replaceExtensionToMp3(filename) {
    return filename.replace(inputExtensionName, outputExtensionName)
}

module.exports = {
    isFile,
    isWavFile,
    inputExtensionName,
    outputExtensionName,
    replaceExtensionToMp3
}