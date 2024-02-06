<template>
  <div>
    <van-nav-bar
      title="SCL-90项症状量表"
      left-arrow
      @click-left="goBack"
    />
    <ul class="content">
      <span style="white-space: pre-wrap;" v-html="measurementJson.scale.instructionalWords"/>
      <van-tabs color="#1989fa" v-model="active" scrollspy sticky ref="tabs">
        <van-tab class="tab-content" v-for="(item,index) in measurementJson.scale. questions"
                 :title="'题目'+item.questionIndex"
                 v-bind:key="index" :name="index" :dot="shouldShowDot(index)">
          <span>{{ item.questionIndex }}.{{ item.questionName }}</span>
          <van-radio-group class="radio-group-content" v-model="result[index]" :name="index">
            <van-radio class="radio-content" v-for="(item,index1) in measurementJson.scale.questionOptions"
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
import measurementJson from '@/assets/questions/SCL90.json'

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
        const scores = {}
        let resultScore = '10项因子结果如下：\n'
        let result = '根据您的测量结果，最终解释如下：\n\n'
        let problemResult = ''
        let clinicResult = ''
        const scoreResult = ['驱体', '强迫', '人际', '抑郁', '焦虑', '敌对', '恐怖', '偏执', '精神病性', '其他（睡眠及饮食）']
        Object.keys(measurementJson.scaleInfo.scl90).forEach((key, index) => {
          if (measurementJson.scaleInfo.scl90.hasOwnProperty(key)) {
            const scale = measurementJson.scaleInfo.scl90[key]
            scores[scoreResult[index]] = Math.floor(this.calculateScore(scale) / scale.length * 10) / 10
          }
        })
        Object.keys(scores).forEach(item => {
          resultScore += `${item}：${scores[item]} 分\n`
        })
        const greaterThanOne = []
        for (const key in scores) {
          if (scores[key] > 2) {
            greaterThanOne.push(scores[key])
          }
        }
        const sortedDescending = greaterThanOne.sort((a, b) => b - a)
        sortedDescending.forEach((item, index) => {
          let obj = Object.entries(scores).find(([key, val]) => val === item)
          if (index === 0) {
            problemResult += `\n突出症状为：${obj[0]}，`
            clinicResult = obj[0]
          } else {
            if (index === 1) {
              problemResult += '伴有：'
            }
            problemResult += `${obj[0]}、`
          }
        })
        problemResult += `其临床诊断是${clinicResult}症。`
        this.measurementResult = result + resultScore + problemResult
      } else {
        this.$toast('您还有未做完的题目，未作答的题目未被标记红点，请继续作答！')
      }
    },
    calculateScore (numeratorItems) {
      let score = 0
      let rules = measurementJson.scaleInfo.scoringRules
      numeratorItems.forEach((item) => {
        if (this.result[item - 1] >= 0 && this.result[item - 1] < rules.length) {
          score += rules[this.result[item - 1]]
        }
      })
      return score
    },
    checkRange (score, range) {
      return range.start < score && score < range.end
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
