import { defineStore } from 'pinia'

interface AppStore {
    collapsed: boolean,
}

export const useAppStore = defineStore('app', {
    state: (): AppStore => {
        return {
            collapsed: false,
        }
    },
})
