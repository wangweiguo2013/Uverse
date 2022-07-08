<template>
    <div class="upload-con">
        <input type="file" ref="fileInput" @change="onFileChange" />
        <br />
        <button @click="onUpload">Upload</button>

        <div class="progress-con">
            <div class="total-progress">
                <div class="total-progress__bar" :style="{width: `${totalPercentage * 100}%`}">
                </div>
            </div>

            <div class="progress-item" v-for="item in fileChunkList" :key="item.index">
                <div class="progress-bar" :style="{ width: `${item.percentage * 100}%` }"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, reactive, toRefs, ref, onMounted } from "vue";
import * as API from '../utils/api'

const SIZE = 20 * 1024 // 10M

export default defineComponent({
    setup(props, { }) {
        const fileChunkList = ref<any[]>([])
        const curFile = ref<any>(null)
        // 总进度条
        const totalPercentage = computed(() => {
            if (!fileChunkList.value.length) return 0;
            const len = fileChunkList.value.length
            let total = 0
            fileChunkList.value.forEach(item => total += item.percentage / len)
            return parseInt(total.toFixed(2));
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
                    hash: filename + '-' + index
                })
                cur += size
            }
            return fileChunkList
        }

        const onUpload = async () => {
            const filename = curFile.value.name
            const promiseList = fileChunkList.value.map((item, idx) => {
                const { chunk, hash } = item
                const onUploadProgress = (progressEvent: ProgressEvent) => {
                    const { loaded, total } = progressEvent
                    console.log('args', progressEvent)
                    item.percentage = (loaded / total).toFixed(2)
                }
                return API.uploadChunk({ chunk, hash: idx, filename }, onUploadProgress)
            })
            await Promise.all(promiseList)
            await API.mergeChunks(filename)
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
        margin: 20px;
        overflow: hidden;

        .total-progress {
            border: 1px dashed #e1e1e1;
            margin-bottom: 6px;
            height: 4px;
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