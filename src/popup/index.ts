import Vue from "vue";
import AppComponent from "./App/App.vue";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);

Vue.config.productionTip = false;
Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
