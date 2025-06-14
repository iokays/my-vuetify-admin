import {reactive} from 'vue';

export const alertDialog = reactive({
  visible: false,
  title: '',
  text: '',
  open: () => {
    alertDialog.visible = true;
  },
  close: () => {
    alertDialog.visible = false
    // alertDialog.title = ''
    // alertDialog.text = ''
    alertDialog.action = () => {
      alertDialog.close()
    }
  },
  action: () => {
    alertDialog.close()
  },
});

import {defineStore} from "pinia";
export const useConfirmDialogStore = defineStore('confirmDialog', {
  state: () => ({
    visible: false,
    title: '',
    text: '',
  }),

  actions: {
    open() {
      this.visible = true;
    },
    close(){
      this.visible = false
      // actionDialog.title = ''
      // actionDialog.text = ''
      this.confirm = this.close
    },
    confirm() {
      this.close()
    }
  }

});
