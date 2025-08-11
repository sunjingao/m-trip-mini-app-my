function debounce(func, delay) {
  let timer = null;
  return function() {
      const context = this;
      const args = arguments;
      if (timer) {
          clearTimeout(timer);
      }
      timer = setTimeout(() => {
          func.apply(context, args);
      }, delay);
  };
}

function cloneDeep(target) {
  if (typeof target !== 'object' || target === null) {
      return target;
  }

  let clone;
  if (Array.isArray(target)) {
      clone = [];
      for (let i = 0; i < target.length; i++) {
          clone[i] = cloneDeep(target[i]);
      }
  } else {
      clone = {};
      for (const key in target) {
          if (target.hasOwnProperty(key)) {
              clone[key] = cloneDeep(target[key]);
          }
      }
  }
  return clone;
}

function createDeepProxy(target, handler, path = []) {
  const newHandler = {
    get(target, property) {
      const value = Reflect.get(target, property);
      if (typeof value === 'object' && value !== null) {
        return createDeepProxy(value, handler, [...path, property]);
      }
      return Reflect.apply(handler.get || Reflect.get, this, [target, property]);
    },
    set(target, property, value) {
      const newPath = [...path, property];
      return Reflect.apply(handler.set || Reflect.set, this, [target, property, value, newPath]);
    }
  };
  return new Proxy(target, newHandler);
}

export {
  debounce,
  cloneDeep,
  createDeepProxy
}