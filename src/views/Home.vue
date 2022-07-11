<template>
    <div class="upload-con">
        <input type="file" ref="fileInput" @change="onFileChange" />
        <br />
        <button @click="onUpload">Upload</button>

        <div class="progress-con">
            <div class="total-progress">

                <div class="total-progress__bar" :style="{ width: `${totalPercentage * 100}%` }">
                </div>
                {{ (totalPercentage * 100).toFixed(2) }}%
            </div>

            <div class="progress-item" v-for="item in fileChunkList" :key="item.index">
                <div class="progress-bar" :style="{ width: `${item.percentage * 100}%` }"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import promiseLimit from "@/utils/promiseLimit";
import { defineComponent, computed, reactive, toRefs, ref, onMounted } from "vue";
import * as API from '../utils/api'

const SIZE = 200 * 1024 // 200kb

export default defineComponent({
    setup(props, { }) {
        const fileChunkList = ref<any[]>([])
        const curFile = ref<any>(null)
        // 总进度条
        const totalPercentage = computed(() => {
            if (!fileChunkList.value.length) return 0;
            const len = fileChunkList.value.length
            let total = 0
            console.log('total', total)
            fileChunkList.value.map(item => total += item.percentage / len)
            return total;
        })

        const onFileChange = (event) => {
            const file = (event.target as HTMLInputElement).files![0]
            curFile.value = file
            fileChunkList.value = createFileChunk(file)
        }
        const createFileChunk = (file, size = SIZE) => {
            const filename = file.name
            const fileChunkList: any[] = []
            let cur = 0
            let index = 0
            console.log('size', file.size)
            while (cur < file.size) {
                fileChunkList.push({
                    chunk: file.slice(cur, cur + size),
                    index: index++,
                    percentage: 0,
                })
                cur += size
            }
            return fileChunkList
        }
        const calculateHash = (file) => {
            const worker = new Worker('/webworker/fileHash.js')
            return new Promise((resolve, reject) => {
                worker.postMessage({ file, chunkSize: SIZE })
                worker.onmessage = (e) => {
                    const { percentage, fileHash } = e.data;
                    // console.log(percentage)
                    if (fileHash) {
                        resolve(fileHash)
                    }
                }
            });
        }

        const onUpload = async () => {
            const filename = curFile.value.name
            const hash = await calculateHash(curFile.value)
            const promiseList = fileChunkList.value.map(async (item, idx) => {
                const { chunk } = item
                item.hash = hash
                const onUploadProgress = (progressEvent: ProgressEvent) => {
                    const { loaded, total } = progressEvent
                    console.log('args', loaded / total)
                    item.percentage = loaded / total
                }
                return API.uploadChunk({ chunk, hash: `${hash}-${idx}`, filename }, onUploadProgress)
            })
            await promiseLimit(promiseList, 6)
            await API.mergeChunks({ filename, size: SIZE })
        }

        return {
            totalPercentage,
            onUpload,
            fileChunkList,
            curFile,
            onFileChange
        }

    }
});

</script>
<style lang="scss">
.upload-con {

    .progress-con {
        margin: 20px 0;
        overflow: hidden;

        .total-progress {
            border: 1px dashed #e1e1e1;
            margin-bottom: 6px;
            overflow: hidden;

            &__bar {
                height: 4px;
                background-color: rgb(37, 160, 94);
            }
        }

        .progress-item {
            width: 40px;
            height: 40px;
            float: left;
            border: 1px solid #e1e1e1;
            margin: 2px;

            .progress-bar {
                height: 100%;
                background-color: rgb(25, 146, 81);
                transition: all 200ms ease-out
            }

        }
    }
}
</style>