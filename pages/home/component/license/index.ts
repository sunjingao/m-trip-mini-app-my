import storeBehavior from "@/behaviors/store/index"
import { jumpNormalWebview } from "@/util/common-url";
import { BASE_URL } from "@/const/config";

Component({

  mixins: [storeBehavior],


  data: {
    footer:
    {
      buttons: [
        {
          text: '不同意并退出', value: 'fail', type: 'default'
        },
        { text: '同意并继续', value: 'success', type: 'primary' }
      ]
    }
  },

  onInit() {
  },


  methods: {

    onGlobalDataChange(globalData) {
    },

    handleConfirm(item) {
      if (item.value === 'success') {
        this.globalDataProxy.isAgreePrivacy = true
      } else {
        my.exitMiniProgram()
      }
    },
    handleGoPrivacy() {
      jumpNormalWebview(`${BASE_URL}/static/secret-mini.html`);
    }
  }
})