
// 向外暴露了一个 globalDataProxy， 可通过 globalDataProxy 直接操作global数据进行全局响应式数据修改

// 外层需包含一个 triggerByGlobal 方法，当全局数据更新时，会触发这个方法执行
const app = getApp();

export default {
  // 定义数据
  data: {},

  // 定义方法
  methods: {},

  // 组件生命周期
  onInit() {
    this.globalDataProxy = app.getGlobalDataProxy();

    if (this.onGlobalDataChange) {
      this.triggerByGlobal = this.onGlobalDataChange.bind(this);
      app.addGlobalDataChangeCb(this.triggerByGlobal);
    }
  },
  didUnmount() {
    if (this.triggerByGlobal) {
      app.removeGlobalDataChangeCb(this.triggerByGlobal);
    }
  },
};
