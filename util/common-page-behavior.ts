
const app = getApp();

function addBehaviorInLoad(self) {
  self.globalDataProxy = app.getGlobalDataProxy();

  if (self.onGlobalDataChange) {
    self.triggerByGlobal = self.onGlobalDataChange.bind(self);
    app.addGlobalDataChangeCb(self.triggerByGlobal);
  }
}

function removeBehaviorInUnMount(self) {
  if (self.triggerByGlobal) {
    app.removeGlobalDataChangeCb(self.triggerByGlobal);
  }
}

export {
  addBehaviorInLoad,
  removeBehaviorInUnMount
}
