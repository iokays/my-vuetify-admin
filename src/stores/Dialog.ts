import {reactive} from 'vue';
import {defineStore} from "pinia";

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

export const useConfirmDialogStore = defineStore('confirmDialog', {
  state: () => ({
    visible: false,
    title: '',
    text: '',
  }),

  actions: {
    open(title: string, text: string) {
      this.visible = true;
      this.title = title
      this.text = text
    },
    close() {
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
