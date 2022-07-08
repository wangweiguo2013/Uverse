import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
    // baseURL: ''
})

instance.interceptors.response.use(
    res => {
        const data = res.data 
        const { success, msg, errMsg } = data
        if(!success) {
            ElMessage.error(msg || errMsg)
        }
        return data
    },
    error => {
        return Promise.reject(error)
    }
)

export default instance