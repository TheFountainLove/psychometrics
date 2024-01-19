<template>
  <div>
    <van-nav-bar
      title="EPQ-艾森克人格问卷量表-成人版"
      left-arrow
      @click-left="goBack"
    />
    <ul class="content">
      <span style="white-space: pre-wrap;" v-html="jsonEpq.scale.instructionalWords"/>
      <van-tabs v-model="active" scrollspy sticky>
        <van-tab v-for="(item,index) in jsonEpq.scale.adultQuestions" :title="'题目'+item.questionIndex"
                 v-bind:key="index" :name="index">
          <span>{{ item.questionIndex }}.{{ item.questionName }}</span>
          <van-radio-group v-model="result(index)" :name="index">
            <van-radio v-for="item in jsonEpq.scale.questionOptions" :name="item+index" v-bind:key="item+index">
                {{ item + index }}
            </van-radio>
          </van-radio-group>
        </van-tab>
      </van-tabs>
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
      active: 0

    }
  },
  computed: {
    result() {
      return function (index) {
        let radioGroup = []
        jsonEpq.scale.questionOptions.forEach((item, index1) => {
          radioGroup[index1] = item + index
        })
        console.log("-------------" + radioGroup)
        return radioGroup
      }
    }
  },
  methods: {

    goBack () {
      router.go(-1)
    }
  }
}

</script>
<style scoped>
.content {
  padding: 10px;
}
</style>
