import { throttle } from 'lodash-es';

Component({

  options: {
    // 允许基础库识别 lifetimes 字段以支持 lifetimes 功能
    lifetimes: true,
  },

  // /**
  //  * 组件的属性列表
  //  */
  // props: {
  //   initTop: {
  //     type: String,
  //   },
  //   initRight: {
  //     type: String,
  //     value: '20px'
  //   },
  //   initBottom: {
  //     type: String,
  //     // value: '100px'
  //     value: '100px'
  //   },
  //   initLeft: {
  //     type: String,
  //     value: null
  //   },
  //   onPosition: {
  //     type: Function
  //   }
  // },

  /**
   * 组件的初始数据
   */
  data: {
    // 模仿节流操作
    enableMove: true,
    diffDisX: 0,
    diffDisY: 0,
    top: null,
    right: "20px",
    bottom: "100px",
    left: null,
  },

  // 暂时没用，仅为后面参考
  observers: {
    'initTop': function(val) {
      // debugger
      // console.log("initTop", this.properties.initTop);
    },
    'top': function(val) {
      // debugger
      // console.log("top", val);
    }
  },

  lifetimes: {
    created() {
      // debugger
      // if (this.props.initTop) {
      //   this.setData({
      //     top: this.props.initTop
      //   })
      // }

      // if (this.props.initRight) {
      //   this.setData({
      //     right: this.props.initRight
      //   })
      // }

      // if (this.props.initBottom) {
      //   this.setData({
      //     bottom: this.props.initBottom
      //   })
      // }

      // if (this.props.initLeft) {
      //   this.setData({
      //     left: this.props.initLeft
      //   })
      // }
    },
    detached() {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTouchstart(e) {
      const targetOffsetTop = e.currentTarget.offsetTop
      const targetOffsetLeft = e.currentTarget.offsetLeft

      const offsetTop = e.touches[0].clientY;
      const offsetLeft = e.touches[0].clientX;


      this.setData({
        diffDisX: offsetLeft - targetOffsetLeft,
        diffDisY: offsetTop - targetOffsetTop
      })
    },

    handleMove(e) {
      // 模仿节流操作
      if (!this.data.enableMove) {
        setTimeout(
          () => {
            this.data.enableMove = true
          },
          60
        )
        return;
      }

      this.data.enableMove = false;

      const offsetTop = e.touches[0].clientY;
      const offsetLeft = e.touches[0].clientX;

      this.setData({
        top: `${offsetTop - this.data.diffDisY}px`,
        left: `${offsetLeft - this.data.diffDisX}px`,
        right: null,
        bottom: null,
      })

      // // 留着这个事件的目的是方便以后参考
      // this.onPosition({
      //   top: `${offsetTop - this.data.diffDisY}px`,
      //   left: `${offsetLeft - this.data.diffDisX}px`,
      // })
    }
  }
})