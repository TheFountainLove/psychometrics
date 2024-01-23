<template>
  <div>
    <van-nav-bar
      title="SAS-抑郁量表"
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
          <van-radio-group class="radio-group-content" v-model="result[index]" :name="index">
            <van-radio class="radio-content" v-for="(item,index1) in  measurementJson.scale.questionOptions"
                       :name="index1" :key="index1">
              {{ item }}
            </van-radio>
          </van-radio-group>
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
import measurementJson from '@/assets/questions/SAS.json'

export default {
  data () {
    return {
      measurementJson: measurementJson,
      active: 0,
      result: {},
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
      if (Object.keys(this.result).length === measurementJson.scale.questions.length) {
        let totalScore = Math.round(1.25 * this.calculateScore())
        let resultDes = measurementJson.scaleInfo.sas.content
        let result = '根据您的测量结果，最终解释如下：\n\n'
        if (this.checkRange(totalScore, measurementJson.scaleStandard.normal[0])) {
          result += '根据测量结果显示,您不存在焦虑情况哦！\n'
        }
        if (this.checkRange(totalScore, measurementJson.scaleStandard.mild[0])) {
          result += '根据测量结果显示,您为轻度焦虑情况，需要特别关注一下哦！\n'
        }
        if (this.checkRange(totalScore, measurementJson.scaleStandard.moderate[0])) {
          result += '根据测量结果显示,您为中度焦虑情况，需要特别关注一下哦！\n'
        }
        if (this.checkRange(totalScore, measurementJson.scaleStandard.seriousness[0])) {
          result += '根据测量结果显示,您为重度焦虑情况，需要特别关注一下哦！\n'
        }
        this.measurementResult = result + resultDes
      } else {
        this.$toast('您还有未做完的题目，未作答的题目未被标记红点，请继续作答！')
      }
    },
    calculateScore () {
      let positiveScore = 0
      let positive = measurementJson.scaleInfo.scoringRules.positive
      let positiveItems = measurementJson.scaleInfo.sas.positive
      positiveItems.forEach((item) => {
        if (this.result[item - 1] >= 0 && this.result[item - 1] < positive.length) {
          positiveScore += positive[this.result[item - 1]]
        }
      })
      let negativeScore = 0
      let negative = measurementJson.scaleInfo.scoringRules.negative
      let negativeItems = measurementJson.scaleInfo.sas.negative
      negativeItems.forEach((item) => {
        if (this.result[item - 1] >= 0 && this.result[item - 1] < negative.length) {
          negativeScore += negative[this.result[item - 1]]
        }
      })
      return positiveScore + negativeScore
    },
    checkRange (score, range) {
      return range.start <= score && score <= range.end
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
}

.radio-group-content {
}

.content {
  padding: 20px;
  position: relative;
}
</style>
