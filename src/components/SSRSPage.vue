<template>
  <div>
    <van-nav-bar
      title="SSRS-社会支持评定量表"
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
          <van-radio-group v-if="item.multipleChoiceQuestions!==1" class="radio-group-content" v-model="result[index]"
                           :name="index">
            <van-radio class="radio-content" v-for="(item,index1) in  item.questionOptions"
                       :name="index1" :key="index1">
              {{ item }}
            </van-radio>
          </van-radio-group>
          <li v-else-if="item.multipleChoiceQuestions===1" class="radio-content"
              v-for="(item, index1) in item.questionOptions" :key="index1">
            ({{ 1 + index1 }}){{ item.source }}
            <van-radio-group v-if="item.multipleChoiceQuestions!==1" class="radio-group-content"
                             v-model="result[index+'_'+index1]"
                             :name="index + '_' + index1">
              <van-radio class="radio-content" v-for="(option, index2) in item.options" :name="index2"
                         :key="index2">
                {{ option }}
              </van-radio>
            </van-radio-group>
            <van-checkbox-group v-else-if="item.multipleChoiceQuestions===1" class="radio-group-content"
                                v-model="result[index+'_'+index1]"
                                :name="index + '_' + index1">

              <van-checkbox shape="square" class="radio-content" v-for="(option, index2) in item.options" :name="index2"
                            :key="index2">
                <div>{{ option }}</div>
              </van-checkbox>
              <van-stepper integer disable-input v-model="result1[index]" style="margin-left: 20px"
                           v-show="index1===1&&item.options.length===9"/>
            </van-checkbox-group>
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
import measurementJson from '@/assets/questions/SSRS.json'
import {uploadScaleResults} from '@/utils/UploadFile'
import moment from 'moment'

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
      if (Object.keys(this.result).length === measurementJson.scale.questions.length) {
        // 创建一个空对象来存储转换后的数据
        const transformedData = {}
        // 遍历原始数据的键值对
        for (const key in this.result) {
          // 提取原始键中的前缀，即 "47"
          const prefix = key.split('_')[0]
          let suffix = key.split('_')[1]
          if (suffix === undefined) {
            suffix = 0
          }
          // 如果 transformedData 中不存在此前缀，则创建一个空数组
          if (!transformedData[prefix]) {
            transformedData[prefix] = []
          }
          // 将原始值添加到以前缀为键的数组中
          transformedData[prefix][suffix] = this.result[key]
        }
        let resultScore = 0
        let resultObjectiveScore = 0
        let resultSubjectiveScore = 0
        let resultUsageScore = 0
        let radio = measurementJson.scaleInfo.scoringRules.radio
        let multipleChoices = measurementJson.scaleInfo.scoringRules.multipleChoices
        let objective = measurementJson.scaleInfo.support.objective
        let subjective = measurementJson.scaleInfo.support.subjective
        let usage = measurementJson.scaleInfo.support.usage
        for (let key in transformedData) {
          let titleIndex = parseInt(key) + 1
          if (radio.topic.indexOf(titleIndex) !== -1) {
            transformedData[key].forEach((item, index) => {
              resultScore += radio.score[item]
              if (objective.topic.indexOf(titleIndex) !== -1) {
                resultObjectiveScore += radio.score[item]
              }
              if (subjective.topic.indexOf(titleIndex) !== -1) {
                resultSubjectiveScore += radio.score[item]
              }
              if (usage.topic.indexOf(titleIndex) !== -1) {
                resultUsageScore += radio.score[item]
              }
            })
          }
          if (multipleChoices.topic.indexOf(titleIndex) !== -1) {
            if (transformedData[key][0] !== undefined) {
              resultScore += multipleChoices.score[0]
            }
            if (transformedData[key][1] !== undefined) {
              transformedData[key][1].forEach((item, index) => {
                let tempScore = 0
                if (item === 8) {
                  tempScore = this.result1[key] * multipleChoices.score[1]
                } else {
                  tempScore = multipleChoices.score[1]
                }
                resultScore += tempScore
                if (objective.topic.indexOf(titleIndex) !== -1) {
                  resultObjectiveScore += tempScore
                }
                if (subjective.topic.indexOf(titleIndex) !== -1) {
                  resultSubjectiveScore += tempScore
                }
                if (usage.topic.indexOf(titleIndex) !== -1) {
                  resultUsageScore += tempScore
                }
              })
            }
          }
        }
        const score = {
          '客观支持程度': resultObjectiveScore,
          '主观支持程度': resultSubjectiveScore,
          '支持的利用程度': resultUsageScore
        }
        let resultDes = '根据您的测量结果，您的总分为：'
        resultDes += resultScore + '。 \n\n'
        resultDes += '您客观支持程度的分数为：' + resultObjectiveScore + '。' + objective.content + '\n\n'
        resultDes += '您主观支持程度的分数为：' + resultSubjectiveScore + '。' + objective.content + '\n\n'
        resultDes += '您对支持的利用程度的分数为：' + resultUsageScore + '。' + objective.content + '\n\n'
        this.measurementResult = resultDes + measurementJson.scaleInfo.ssrs.content
        const time = moment().format('YYYY-MM-DD HH:mm:ss')
        uploadScaleResults('ssrs', {
          'options': [this.result, this.result1],
          'structureScore': score,
          'score': resultScore,
          'content': this.measurementResult,
          'createTime': time
        })
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

  .van-stepper {
    padding-top: 20px;
  }
}

.radio-group-content {
}

.content {
  padding: 20px;
  position: relative;
}
</style>
