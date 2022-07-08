
// 获取文件分块
const getFileChunk = (file, chunkSize = DefualtChunkSize) => {
    return new Promise((resovle) => {
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader();

        fileReader.onload = function (e) {
            console.log('read chunk nr', currentChunk + 1, 'of');

            const chunk = e.target.result;
            spark.append(chunk);
            currentChunk++;

            if (currentChunk < chunks) {
                loadNext();
            } else {
                let fileHash = spark.end();
                console.info('finished computed hash', fileHash);
                resovle({ fileHash });
            }
        };

        fileReader.onerror = function () {
            console.warn('oops, something went wrong.');
        };

        function loadNext() {
            let start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
            let chunk = blobSlice.call(file, start, end);
            fileChunkList.value.push({ chunk, size: chunk.size, name: currFile.value.name });
            fileReader.readAsArrayBuffer(chunk);
        }

        loadNext();
    });
}
