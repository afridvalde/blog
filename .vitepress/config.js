import { defineConfig } from "vitepress";
import { getPosts } from "./theme/serverUtils";

//每页的文章数量
const pageSize = 10;

export default defineConfig({
  title: "LOLI.AE",
  base: "/",
  cleanUrls: true,
  cacheDir: "./node_modules/vitepress_cache",
  description: "blog,loli.ae",
  ignoreDeadLinks: true,
  themeConfig: {
    posts: await getPosts(pageSize),
    website: "https://github.com/airene/vitepress-blog-pure", //copyright link
    // 评论的仓库地址
    comment: {
      repo: "afridvalde/blog",
      themes: "github-light",
      issueTerm: "pathname",
    },
    nav: [
      { text: "家", link: "/" },
      { text: "分类", link: "/pages/category" },
      { text: "存档", link: "/pages/archives" },
      { text: "标签", link: "/pages/tags" },
      // { text: 'About', link: '/pages/about' }
      // { text: 'Airene', link: 'http://airene.net' }  -- External link test
    ],
    search: {
      provider: "local",
    },
    outline: [2, 3],
    outlineTitle: "文章摘要",
    socialLinks: [
      // { icon: 'github', link: 'https://github.com/airene/vitepress-blog-pure' }
    ],
  },
  srcExclude: ["README.md"], // exclude the README.md , needn't to compiler

  vite: {
    //build: { minify: false }
    server: { port: 5000 },
  },
  sitemap: {
    hostname: "https://loli.ae",
  },
  head: [
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-23978B76XE",
      },
    ],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-23978B76XE');`,
    ],
  ],
  /*
      optimizeDeps: {
          keepNames: true
      }
      */
});
