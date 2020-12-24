---
layout: post
title: "github pages静态网页创建"
author: "Luo"
categories: [home,notes]
tags: [home,question,notes]
discription: '注册并使用github创建静态页面流程'
image: arctic-1.jpg
---

## 用github创建个人网站的方法

1.注册一个github账号

2.创建仓库

​	登录之后创建仓库

![img]({{ site.github.url }}/assets/img/git/git_image_1.png)

**如果是个人单页的话输入的仓库名要是username.github.io形式的**

![img]({{ site.github.url }}/assets/img/git/git_image_2.png)

如下图仓库就建好了，不过只有readme.md文件

![img]({{ site.github.url }}/assets/img/git/git_image_3.png)

3.创建SSH-key，是用来决定你的本地电脑是不是可以修改这个仓库

进入[GitHub:SSH](https://help.github.com/articles/connecting-to-github-with-ssh/%E7%BD%91)站进行设置

4.创建项目后进入仓库-》setting，然后拉到最下面，有个GitHub Pages设置，这一步很重要，不设置的话网页打开没内容

![img]({{ site.github.url }}/assets/img/git/git_image_4.png)

选择要使用的分支和路径，然后点击save保存，如下图说明设置成功了，可以访问所给的网页了

![img]({{ site.github.url }}/assets/img/git/git_image_5.png)

5.仓库创建以后可以上传代码

```
git clone 你的SSH地址 （下载你的reposity，这个地址可以用网页浏览的Clone-or-Download-use SSH按钮看到，比如说git@github.com:uername/reposity.git）
git pull （联系服务器，更新本地文件夹）
git add --all （写入本地的所有新文件）
git commit -am "随便说点啥" （在本地进行一次有记录地更新，包括本地所有文件的修改）
git push origin main （把本地的更新推送到服务器）
```

