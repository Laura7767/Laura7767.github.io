---
layout: post
title: "vue启动时报错"
author: "Luo"
categories: [home,question]
tags: [home,question,notes]
discription: 'vue启动时npm有时会报错，是版本不兼容导致的'
image: arctic-4.jpg
---

#### npm install安装报错，后npm run dev运行报错

node和npm版本不兼容导致的

```
This dependency was not found:
* qs in ./src/utils/httpRequest.js
To install it, you can run: npm install --save qs
```

解决： 

```
npm install --save-dev node-sass
npm install --save node-sass (待测试)
npm rebuild node-sass（常用）
```

#### npm install报错 

chromedriver不兼容导致的 

```
error code ELIFECYCLE
error errno 1
error chromedriver@2.27.2 install: `node install.js`
error Exit status 1
error Failed at the chromedriver@2.27.2 install script.
error This is probably not a problem with npm. There is likely additional logging output above.
```

解决：

```
npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver
```
