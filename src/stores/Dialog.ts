import { reactive } from 'vue';

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
    alertDialog.action = () => {alertDialog.close() }
  },
  action: () => { alertDialog.close() },
});

export const actionDialog = reactive({
  visible: false,
  title: '',
  text: '',
  open: () => {
    actionDialog.visible = true;
  },
  close: () => {
    actionDialog.visible = false
    // actionDialog.title = ''
    // actionDialog.text = ''
    actionDialog.leftAction = () => {actionDialog.close()}
    actionDialog.rightAction = () => {actionDialog.close()}

  },
  leftAction: () => { actionDialog.close() },
  rightAction: () => { actionDialog.close() },
});
