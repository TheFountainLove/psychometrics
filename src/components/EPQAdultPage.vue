<template>
  <div>
    <van-nav-bar
      title="EPQ-艾森克人格问卷量表-成人版"
      left-arrow
      @click-left="goBack"
    />
    <ul class="content">
      <span style="white-space: pre-wrap;" v-html="jsonEpq.scale.instructionalWords"/>
      <van-tabs color="#1989fa" v-model="active" scrollspy sticky ref="tabs">
        <van-tab class="tab-content" v-for="(item,index) in jsonEpq.scale.adultQuestions"
                 :title="'题目'+item.questionIndex"
                 v-bind:key="index" :name="index" :dot="shouldShowDot(index)">
          <span>{{ item.questionIndex }}.{{ item.questionName }}</span>
          <van-radio-group class="radio-group-content" v-model="result[index]" :name="index">
            <van-radio class="radio-content" v-for="(item,index1) in jsonEpq.scale.questionOptions"
                       :name="index1" :key="index1">
              {{ item }}
            </van-radio>
          </van-radio-group>
        </van-tab>
      </van-tabs>
      <van-button class="button-content" type="info" size="large" :round="true" @click="getEpqResult">获取结果
      </van-button>
      <van-icon name="back-top" color="#1989fa" size="30px" class="floating-button" v-show="showButton" @click="scrollToTop"/>
      <span style="display: flex;white-space: pre-wrap;margin-top: 20px">{{ epqResult }}</span>
    </ul>
  </div>
</template>
<script>
import router from '@/router'
import jsonEpq from '@/assets/questions/EPQ.json'

export default {
  data () {
    return {
      jsonEpq: jsonEpq,
      active: 0,
      result: {},
      epqResult: '',
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
      this.showButton = window.pageYOffset > 500
    },
    scrollToTop () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // 平滑滚动
      })
    },
    goBack () {
      router.go(-1)
    },
    shouldShowDot (index) {
      return this.result[index] !== undefined
    },
    getEpqResult () {
      if (this.result.length === jsonEpq.scale.adultQuestions.length) {
        let eScore = this.calculateScore(jsonEpq.scaleInfo['E'].positive, jsonEpq.scaleInfo['E'].negative)
        let nScore = this.calculateScore(jsonEpq.scaleInfo['N'].positive, jsonEpq.scaleInfo['N'].negative)
        let pScore = this.calculateScore(jsonEpq.scaleInfo['P'].positive, jsonEpq.scaleInfo['P'].negative)
        let lScore = this.calculateScore(jsonEpq.scaleInfo['L'].positive, jsonEpq.scaleInfo['L'].negative)
        let totalScore = eScore + nScore + pScore + lScore
        let normal = jsonEpq.scaleStandard.epq.normal[0]
        let mild1 = jsonEpq.scaleStandard.epq.mild[0]
        let mild2 = jsonEpq.scaleStandard.epq.mild[1]
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
        let intermediate = jsonEpq.scaleStandard.intermediate[0]
        let predisposition1 = jsonEpq.scaleStandard.predisposition[0]
        let predisposition2 = jsonEpq.scaleStandard.predisposition[1]
        let typical1 = jsonEpq.scaleStandard.typical[0]
        let typical2 = jsonEpq.scaleStandard.typical[1]
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
        this.epqResult = '最终结果解释如下：\n\n' + result + eResult + pResult + nResult + lResult
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
.floating-button {
  position: fixed;
  bottom: 160px;
  right: 20px;
  z-index: 9999;
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
