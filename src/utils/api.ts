import request from './request'

export const uploadChunk = ({ chunk, hash, filename }, onUploadProgress) => {
    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('hash', hash)
    formData.append('filename', filename)
    return request({
        method: 'post',
        url: 'http://localhost:3000/upload',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: formData,
        onUploadProgress
    });
}

export const mergeChunks = (data) => {
    return request({
        method: 'post',
        url: 'http://localhost:3000/merge',
        headers: {
            'Content-Type': 'application/json'
        },
        data
    });
}



