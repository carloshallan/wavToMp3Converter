# Wav to mp3 converter

A simple script to convert and rename massive audio files based on a unique prefix.

### Installation (MacOS)

```shell
npm install; brew install ffmpeg
```

For use in another OS just change the ffmpeg installation command to your OS.

### How to use

Just call `npm start` or `yarn start` with 2 arguments.
```shell
yarn start `user/some/directory/path` `prefix`
```
For example, if you have 2 files with the names:

- myDir
    - audio(1).wav
    - audio(2).wav

to convert and rename:

```shell
yarn start `myDir/` `newName`
```
```
// output

myDir/newName-1.mp3
myDir/newName-2.mp3
```