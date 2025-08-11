Component({
  mixins: [],
  data: {
    value: '',
    visible: true,
  },
  props: {
    onFinish: Function
  },
  methods: {
    onCodeFocus() {
      this.setData({ visible: true });
    },
    onChange(e) {
      this.setData({ value: e });
      e.length === 6 && this.onClose();
    },
    onClose() {
      this.setData({ visible: false });
  
      this.props.onFinish(
        this.data.value
      )
    },
  },
  didMount() {
   },
  didUpdate() { },
  didUnmount() { },
});
