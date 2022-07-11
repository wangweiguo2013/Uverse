self.importScripts('./spark-md5.min.js')


self.onmessage = e => {
    const { file, chunkSize } = e.data
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

    fileReader.onload = function (e) {
        console.log('read chunk nr', currentChunk + 1, 'of');

        const chunk = e.target.result;
        spark.append(chunk);
        currentChunk++;

        if (currentChunk < chunks) {
            loadNext();
        } else {
            let fileHash = spark.end();
            console.info('finished computed hash', fileHash);
            // 此处为重点，计算完成后，仍然通过postMessage通知主线程
            self.postMessage({ fileHash })
        }
    };

    fileReader.onerror = function () {
        console.warn('oops, something went wrong.');
    };

    function loadNext() {
        let start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        let chunk = blobSlice.call(file, start, end);
        fileReader.readAsArrayBuffer(chunk);
    }

    loadNext();
};
