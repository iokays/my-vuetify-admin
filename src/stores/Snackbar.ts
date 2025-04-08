import { reactive } from 'vue';

export const snackbar = reactive({
  visible: false,
  timeout: 2000,
  text: '',
  open: () => {
    snackbar.visible = true;
  },
  close: () => {
    snackbar.visible = false
    snackbar.text = ''
  }
});

