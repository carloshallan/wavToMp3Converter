const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const {isFile, isWavFile, inputExtensionName, outputExtensionName} = require('./utils')

async function splitAudioOnSilence(inputFile, outputDir) {
    const silenceThreshold = -50 // Adjust this value according to your needs (in dB)
    const silenceDuration = 1 // Duration of silence to be considered as a separator (in seconds)

    return new Promise((resolve, reject) => {
        let silenceStartTimes = []

        ffmpeg(inputFile)
            .outputOptions('-f', 'null', '-')
            .audioFilters(`silencedetect=noise=${silenceThreshold}dB:d=${silenceDuration}`)
            .on('stderr', (stderrLine) => {
                const silenceMatch = stderrLine.match(/silence_start: (\d+(\.\d+)?)/)
                if (silenceMatch) {
                    silenceStartTimes.push(parseFloat(silenceMatch[1]))
                }
            })
            .on('error', (err) => {
                reject(err)
            })
            .on('end', async () => {
                let prevSilenceEnd = 0
                const promises = []

                for (let i = 0; i < silenceStartTimes.length; i++) {
                    const start = prevSilenceEnd
                    const end = silenceStartTimes[i]
                    const duration = end - start

                    const outputFilename = `${outputDir}/split_${i}.mp3`
                    const promise = new Promise((resolve, reject) => {
                        ffmpeg(inputFile)
                            .setStartTime(start)
                            .setDuration(duration)
                            .output(outputFilename)
                            .on('error', (err) => {
                                reject(err)
                            })
                            .on('end', () => {
                                resolve(outputFilename)
                            })
                            .run()
                    })

                    promises.push(promise)
                    prevSilenceEnd = end + silenceDuration
                }

                const splitFiles = await Promise.all(promises)
                resolve(splitFiles)
            })
            .run()
    })
}

function convertWavToMp3(filename) {
    return new Promise((resolve, reject) => {
        if (!isWavFile(filename)) throw new Error('This file is not a wav file.')

        const outputFile = filename.replace(inputExtensionName, outputExtensionName)

        ffmpeg({source: filename})
            .on('error', (err) => {
                reject(err)
            })
            .on('end', () => {
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
            } else {
                convert(filepath)
            }
        })
    })
}


module.exports = {
    convert,
    convertWavToMp3,
    splitAudioOnSilence
}