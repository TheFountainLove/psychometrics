<template>
  <div class="hello">
    <img src="../assets/images/img_focus_solution.jpg" alt=""/>
    <h3>{{ msg }}</h3>
    <h4>选择心理量表，进入测评。</h4>
    <ul>
      <li>
        <router-link :to="RouterPath.EPQAdult.path">EPQ-艾森克人格问卷量表-成人版</router-link>
      </li>
      <li>
        <router-link :to="RouterPath.EPQAdult.path">EPQ-艾森克人格问卷量表-儿童版</router-link>
      </li>
      <li>
        <router-link to="/">LES-生活事件应激量表</router-link>
      </li>
      <li>
        <router-link to="/">CSQ-应对方式量表</router-link>
      </li>
      <li>
        <router-link to="/">SSRS-社会支持评定量表</router-link>
      </li>
      <li>
        <router-link to="/">SCL-90项症状量表</router-link>
      </li>
      <li>
        <router-link to="/">SAS-焦虑量表</router-link>
      </li>
      <li>
        <router-link to="/">SDS-抑郁量表</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import {RouterPath} from '@/const/RouterPath'

export default {
  name: 'Home',
  data () {
    return {
      RouterPath,
      msg: '欢迎来到焦点解决Center,请开始您的心理测评之旅吧。'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  font-weight: normal;
  padding-left: 20px;
  padding-right: 20px;
}

ul {
  list-style-type: disc;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: center;
}

li {
  display: list-item;
  margin: 0 10px;
}

a {
  color: #42b983;
}

img {
  width: 120px;
  height: 120px;
}
</style>
