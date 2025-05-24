// src/stores/snackbar.ts
import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    visible: false,
    text: '',
    timeout: 2000,
    color: 'primary',
  }),
  actions: {
    open(message: string, timeout = 2000) {
      this.text = message
      this.timeout = timeout
      this.visible = true
    },
    error(message: string, timeout = 2000) {
      this.text = message
      this.timeout = timeout
      this.visible = true
    },
    close() {
      this.visible = false
    }
  }
})
