<template>
  <div>
    <van-nav-bar
      title="LES-生活事件应激量表"
      left-arrow
      @click-left="goBack"
    />
    <ul class="content">
      <span style="white-space: pre-wrap;" v-html=" measurementJson.scale.instructionalWords"/>
      <van-tabs color="#1989fa" v-model="active" scrollspy sticky ref="tabs">
        <van-tab class="tab-content" v-for="(item,index) in  measurementJson.scale.questions"
                 :title="'题目'+item.questionIndex"
                 v-bind:key="index" :name="index" :dot="shouldShowDot(index)">
          <span>{{ item.questionIndex }}.{{ item.questionName }}</span>
          <li class="radio-content" v-for="(item, index1) in measurementJson.scale.questionOptions" :key="index1">
            ({{ 1 + index1 }}){{ item.name }}
            <van-radio-group class="radio-group-content" v-model="result[index+'_'+index1]"
                             :name="index + '_' + index1" >
              <van-radio class="radio-content" v-for="(option, index2) in item.options" :name="index2"
                         :key="index2">
                <div>{{ option }}</div>
                <van-stepper integer disable-input v-model="result1[index]" style="margin-left: 20px" v-show="index1===2&&index2===2"/>
              </van-radio>
            </van-radio-group>
          </li>
        </van-tab>
      </van-tabs>
      <van-button class="button-content" type="info" size="large" :round="true" @click="getResult">获取结果
      </van-button>
      <van-icon name="back-top" color="#1989fa" size="30px" class="floating-button-top" v-show="showButton" @click="scrollToTop"/>
      <van-icon name="back-top" color="#1989fa" size="30px" class="floating-button-bottom" v-show="showButton" @click="scrollToBottom"/>
      <span style="display: flex;white-space: pre-wrap;margin-top: 20px">{{ measurementResult }}</span>
    </ul>
  </div>
</template>
<script>
import router from '@/router'
import measurementJson from '@/assets/questions/LES.json'

export default {
  data () {
    return {
      measurementJson: measurementJson,
      active: 0,
      result: {},
      result1: {},
      measurementResult: '',
      showButton: false
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      this.showButton = window.scrollY > 200
    },
    scrollToTop () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // 平滑滚动
      })
    },
    scrollToBottom () {
      const container = document.documentElement
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth' // 平滑滚动
      })
    },
    goBack () {
      router.go(-1)
    },
    shouldShowDot (index) {
      return this.result[index] !== undefined
    },
    getResult () {
      if (Object.keys(this.result).length === measurementJson.scale.questions.length * measurementJson.scale.questionOptions.length) {
        // 创建一个空对象来存储转换后的数据
        const transformedData = {}
        // 遍历原始数据的键值对
        for (const key in this.result) {
          // 提取原始键中的前缀，即 "47"
          const prefix = key.split('_')[0]
          const suffix = key.split('_')[1]
          // 如果 transformedData 中不存在此前缀，则创建一个空数组
          if (!transformedData[prefix]) {
            transformedData[prefix] = []
          }
          // 将原始值添加到以前缀为键的数组中
          transformedData[prefix][suffix] = this.result[key]
        }
        let resultScore = 0
        let degreeOfImpact = measurementJson.scaleInfo.scoringRules.degreeOfImpact
        let duration = measurementJson.scaleInfo.scoringRules.duration
        let numberOfEvents = measurementJson.scaleInfo.scoringRules.numberOfEvents
        for (const key in transformedData) {
          if (!isNaN(transformedData[key][0])) {
            resultScore += degreeOfImpact[transformedData[key][0]]
          }
          if (!isNaN(transformedData[key][1])) {
            resultScore += duration[transformedData[key][1]]
          }
          if (!isNaN(transformedData[key][2])) {
            if (transformedData[key][2] === 2) {
              resultScore += this.result1[key]
            } else {
              resultScore += numberOfEvents[transformedData[key][2]]
            }
          }
        }
        let resultDes = '根据您的测量结果，您的总分为：'
        resultDes += resultScore + '。 \n\n'
        this.measurementResult = resultDes + measurementJson.scaleInfo.les.content
      } else {
        this.$toast('您还有未做完的题目，未作答的题目未被标记红点，请继续作答！')
      }
    }
  }
}

</script>
<style scoped>
.floating-button-top {
  position: fixed;
  bottom: 160px;
  right: 20px;
  z-index: 9999;
}
.floating-button-bottom {
  position: fixed;
  bottom: 130px;
  right: 20px;
  z-index: 9999;
  transform: rotate(180deg)
}
.button-content{
  margin-top: 20px;
}
.tab-content {
  margin-top: 20px;
}

.radio-content {
  padding-top: 20px;

  .van-radio__label {
    display: flex;
    align-items: center;
  }
}

.radio-group-content {
}

.content {
  padding: 20px;
  position: relative;
}
</style>
