import Worker from './webworker/fileHash.js?worker'
export const calculateHash = (file) => {
    const worker = new Worker()
    return new Promise((resolve, reject) => {
        worker.postMessage(file)
        worker.onmessage = (e) => {
            const { percentage, hash } = e.data;
            console.log(percentage)
            if (hash) {
                resolve(hash)
            }
        }
    });
};
