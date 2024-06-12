import DefaultTheme from "vitepress/theme";
import { onMounted, watch, nextTick } from "vue";
import { useRoute } from "vitepress";
import mediumZoom from "medium-zoom";

import NewLayout from "./components/NewLayout.vue";
import Archives from "./components/Archives.vue";
import Category from "./components/Category.vue";
import Tags from "./components/Tags.vue";
import Page from "./components/Page.vue";
import Comment from "./components/Comment.vue";

import "./custom.css";

export default {
  ...DefaultTheme,
  Layout: NewLayout,
  enhanceApp({ app }) {
    // register global compoment
    app.component("Tags", Tags);
    app.component("Category", Category);
    app.component("Archives", Archives);
    app.component("Page", Page);
    app.component("Comment", Comment);
  },
  setup() {
    const route = useRoute();
    const initZoom = () => {
      //   mediumZoom("[data-zoomable]", { background: "var(--vp-c-bg)" });
      mediumZoom(".main img", { background: "var(--vp-c-bg)", margin: 24 });
    };
    onMounted(() => {
      initZoom();
    });
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
};
