<template>
  <div>
    <van-nav-bar
      title="EPQ-艾森克人格问卷量表-成人版"
      left-arrow
      @click-left="goBack"
    />
    <ul class="content">
      <span style="white-space: pre-wrap;" v-html=" measurementJson.scale.instructionalWords"/>
      <van-tabs color="#1989fa" v-model="active" scrollspy sticky ref="tabs">
        <van-tab class="tab-content" v-for="(item,index) in  measurementJson.scale.adultQuestions"
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
import measurementJson from '@/assets/questions/EPQ.json'
import {uploadScaleResults} from '@/utils/UploadFile'
import moment from 'moment'

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
      if (Object.keys(this.result).length === measurementJson.scale.adultQuestions.length) {
        let eScore = this.calculateScore(measurementJson.scaleInfo['E'].positive, measurementJson.scaleInfo['E'].negative)
        let nScore = this.calculateScore(measurementJson.scaleInfo['N'].positive, measurementJson.scaleInfo['N'].negative)
        let pScore = this.calculateScore(measurementJson.scaleInfo['P'].positive, measurementJson.scaleInfo['P'].negative)
        let lScore = this.calculateScore(measurementJson.scaleInfo['L'].positive, measurementJson.scaleInfo['L'].negative)
        let totalScore = eScore + nScore + pScore + lScore
        let score = {
          'E': eScore,
          'N': nScore,
          'P': pScore,
          'L': lScore
        }
        let normal = measurementJson.scaleStandard.epq.normal[0]
        let mild1 = measurementJson.scaleStandard.epq.mild[0]
        let mild2 = measurementJson.scaleStandard.epq.mild[1]
        let result = ''
        if (this.checkRange(totalScore, normal)) {
          result += `您的EPQ-艾森克人格问卷量表-成人版得分为${totalScore}，在人群中占比大约68.46%。\n`
        }
        if (this.checkRange(totalScore, mild1)) {
          result += `您的EPQ-艾森克人格问卷量表-成人版得分为${totalScore}，在EPQ某个量表上具有低分，需要特别关注一下哦！\n`
        }
        if (this.checkRange(totalScore, mild2)) {
          result += `您的EPQ-艾森克人格问卷量表-成人版得分为${totalScore}，在EPQ某个量表上具有高分，需要特别关注一下哦！\n`
        }
        let eResult = ''
        let nResult = ''
        let pResult = ''
        let lResult = ''
        let intermediate = measurementJson.scaleStandard.intermediate[0]
        let predisposition1 = measurementJson.scaleStandard.predisposition[0]
        let predisposition2 = measurementJson.scaleStandard.predisposition[1]
        let typical1 = measurementJson.scaleStandard.typical[0]
        let typical2 = measurementJson.scaleStandard.typical[1]
        if (intermediate.start < eScore && intermediate.end) {
          eResult += '根据测量结果显示，您性格倾向属于正常。\n'
        }
        if (predisposition1.start < eScore && predisposition1.end) {
          eResult += '根据测量结果显示，您性格倾向属于偏内向型。\n'
        }
        if (predisposition2.start < eScore && predisposition2.end) {
          eResult += '根据测量结果显示，您性格倾向属于偏外向型。\n'
        }
        if (typical1.start < eScore && typical1.end) {
          eResult += '根据测量结果显示，您性格倾向属于典型的内向型。\n'
        }
        if (typical2.start < eScore && typical2.end) {
          eResult += '根据测量结果显示，您性格倾向属于典型的外向型。\n'
        }
        if (intermediate.start < nScore && intermediate.end) {
          nResult += '根据测量结果显示，您情绪稳定倾向属于正常。\n'
        }
        if (predisposition1.start < nScore && predisposition1.end) {
          nResult += '根据测量结果显示，您情绪稳定倾向属于偏稳定型。\n'
        }
        if (predisposition2.start < nScore && predisposition2.end) {
          nResult += '根据测量结果显示，您情绪稳定倾向属于偏不稳定型。\n'
        }
        if (typical1.start < nScore && typical1.end) {
          pResult += '根据测量结果显示，您情绪稳定倾向属于典型的稳定型。\n'
        }
        if (typical2.start < nScore && typical2.end) {
          pResult += '根据测量结果显示，您情绪稳定属于典型的不稳定型。\n'
        }
        if (intermediate.start < pScore && intermediate.end) {
          pResult += '根据测量结果显示，您心理正常倾向属于中间型。\n'
        }
        if ((predisposition1.start < pScore && predisposition1.end) || (predisposition2.start < pScore && predisposition2.end)) {
          pResult += '根据测量结果显示，您心理正常倾向属于倾向型。\n'
        }
        if ((typical1.start < pScore && typical1.end) || (typical2.start < pScore && typical2.end)) {
          pResult += '根据测量结果显示，您心理正常倾向属于典型型。\n'
        }
        if (lScore > 60) {
          lResult += '根据测量结果显示，你的作答结果无效，存在一定的掩饰，请重新作答！\n'
        }
        // console.log(result, eResult, pResult, nResult, lResult)
        this.measurementResult = '最终结果解释如下：\n\n' + result + eResult + pResult + nResult + lResult
        const time = moment().format('YYYY-MM-DD HH:mm:ss')
        uploadScaleResults('epqAdult', {
          'options': [this.result],
          'structureScore': score,
          'score': totalScore,
          'content': this.measurementResult,
          'createTime': time
        })
      } else {
        this.$toast('您还有未做完的题目，未作答的题目未被标记红点，请继续作答！')
      }
    },
    calculateScore (positiveItems, negativeItems) {
      let positiveScore = 0
      positiveItems.forEach((item) => {
        if (this.result[item - 1] === 0) {
          positiveScore++
        }
      })

      let negativeScore = 0
      negativeItems.forEach((item) => {
        if (this.result[item - 1] === 1) {
          negativeScore++
        }
      })
      return positiveScore + negativeScore
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
