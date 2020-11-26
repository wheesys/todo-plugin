import Vue from "vue";
import AppComponent from "./App/App.vue";
import 'ant-design-vue/dist/antd.css';
import Antd, {Checkbox, List} from "ant-design-vue";

Vue.config.productionTip = false;
Vue.component("app-component", AppComponent);
Vue.use(List);
Vue.use(Antd);
Vue.use(Checkbox);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
