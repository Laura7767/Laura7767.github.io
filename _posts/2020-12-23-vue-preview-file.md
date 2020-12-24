---
layout: post
title: "vue文件预览兼容问题"
author: "Luo"
categories: [home,question]
tags: [home,question,notes]
discription: 'vue用文件流预览文件会被浏览器拦截弹窗'
image: cuba-1.jpg
---

#### 比较完整的文件预览兼容性问题解决

要在接口调用前创建窗口，要不然会被拦截

​    1. base64图片预览

```
const img = new Image();
img.src = 'data:image/' + type + ';base64,' + data.msg;
winRef.document.write(img.outerHTML);
winRef.document.title = fileName
winRef.document.close();
```

​     2. 入口
```
<a v-if="/\XLSX|XLS|HTML|HTM|PDF|JPG|JPEG|PNG|BMP|GIF|DOC|DOCX$/.test(scope.row.fileSuffix.toUpperCase())" href="javascript:;" @click="previewPic(scope.row.fileUrl, scope.row.fileName, scope.row.fileSuffix)">{{scope.row.fileName}}</a>

<a v-else href="javascript:;" @click="openImg(scope.row.fileUrl, scope.row.fileName, scope.row.fileSuffix)">{{scope.row.fileName}}</a>
```
​     3. 操作
```
previewPic (url, fileName, fileSuffix) {
      let newpage = this.$router.resolve({
        path: `/previewPic/` + encodeURIComponent(encodeURIComponent(url)) + '?type=' + encodeURIComponent(fileSuffix) + '&name=' + encodeURIComponent(fileName)
      })
      window.open(newpage.href, '_blank')
    },

  openImg (url, fileName, fileSuffix) {
      let loading = Loading.service({
        lock: true,
        text: '加载中，请稍候...',
        background: 'rgba(256, 256, 256, 0.7)'
      });
      if (fileSuffix.toUpperCase() == 'PDF') {
        this.$http({
          url: this.$http.adornUrl(`/common/fileShow/previewFile`),
          method: 'post',
          responseType: 'arraybuffer',
          params: this.$http.adornParams({fileUrl: url})
        }).then((res) => {
          loading.close()
          var blob = new Blob([res.data], {type: res.headers['content-type'] + ';charset=UTF-8'})
          let that = this
          let reader = new FileReader();
          reader.onload = function (event) {
            let content = reader.result;
            try {
              that.newWin = window.SITE_CONFIG.cdnUrl + '/static/pdf/web/viewer.html?file=' + URL.createObjectURL(blob) + '&name=' + encodeURIComponent(fileName)
            } catch (err) {
              let message = JSON.parse(content);
              if (message.code != 200) {
                that.$message.warning(message.msg);
              }
            }
          };
          reader.readAsText(blob)
          return true;
        })
      } else if (fileSuffix.toUpperCase() == 'DOC' || fileSuffix.toUpperCase() == 'DOCX') {
        this.$http({
          url: this.$http.adornUrl(`/common/fileShow/toHtml/${url}`),
          method: 'get',
          responseType: 'arraybuffer'
        }).then((res) => {
          loading.close()
          var blob = new Blob([res.data], {type: res.headers['content-type'] + ';charset=UTF-8'})
          let that = this
          let reader = new FileReader();
          reader.onload = function (event) {
            let content = reader.result;
            try {
              that.newWin = window.SITE_CONFIG.cdnUrl + '/static/pdf/web/viewer.html?file=' + URL.createObjectURL(blob) + '&name=' + encodeURIComponent(fileName)
            } catch (err) {
              let message = JSON.parse(content);
              if (message.code != 200) {
                that.$message.warning(message.msg);
              }
            }
          };
          reader.readAsText(blob)
          return true;
        })
      } else if (/\JPG|JPEG|PNG|BMP|GIF$/.test(fileSuffix.toUpperCase())) {
        this.$http({
          url: this.$http.adornUrl(`/common/fileShow/toHtml/${url}`),
          method: 'get'
        }).then((res) => {
          loading.close()
          let width = window.screen.width || screen.width
          const img = new Image();
          img.src = 'data:image/' + fileSuffix + ';base64,' + res.data.msg;
          img.style.maxWidth = width - 25 + 'px'
          const openWin = window.open('', '_blank');
          openWin.document.write(img.outerHTML);
          openWin.document.title = fileName
          openWin.document.close();
        })
      } else {
        this.$http({
          url: this.$http.adornUrl(`/common/fileShow/previewFile`),
          method: 'post',
          responseType: 'arraybuffer',
          params: this.$http.adornParams({fileUrl: url})
        }).then((res) => {
          loading.close()
          var blob = new Blob([res.data], {type: res.headers['content-type'] + ';charset=UTF-8'})
          downFile(blob, fileName)
        })
      }
    }
```
​     4. 跳转处理页面
```
<template>
  <div>
    <iframe :src="newWin" frameborder="0" v-if="/\PDF|DOC|DOCX$/.test(this.fileSuffix.toUpperCase())" width="100%" :height="styleObject.height"></iframe>
    <img :src="imgSrc" v-else-if="/\JPG|JPEG|PNG|BMP|GIF$/.test(this.fileSuffix.toUpperCase())" :style="{'max-width': maxWidth}" alt="">
    <div class="html-wrap" v-html="alipayWap" v-else></div>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
export default {
  data () {
    return {
      alipayWap: '',
      fileSuffix: '',
      styleObject: {
        height: '800px'
      },
      maxWidth: 'auto',
      url: '',
      imgSrc: '',
      fileName: '',
      newWin: ''
    }
  },
  created () {
    this.fileSuffix = ''
    if (this.$route.params.url) {
      this.url = decodeURIComponent(decodeURIComponent(this.$route.params.url))
      let type = decodeURIComponent(this.$route.query.type)
      this.fileSuffix = type
      this.fileName = decodeURIComponent(this.$route.query.name)
    }
    let width = window.screen.width || screen.width
    this.maxWidth = width - 25 + 'px'
    let loading = Loading.service({
      lock: true,
      text: '解析中，请稍候...',
      background: 'rgba(256, 256, 256, 0.7)'
    });
    if (/\XLSX|XLS|HTML|HTM$/.test(this.fileSuffix.toUpperCase())) {
      this.$http({
        url: this.$http.adornUrl(`/common/fileShow/toHtml/${this.url}`),
        method: 'get'
      }).then((res) => {
        loading.close()
        if (res.data && res.data.code) {
          this.$message.warning(res.data.msg)
        } else {
          this.alipayWap = res.data
        }
      })
    } else if (this.fileSuffix.toUpperCase() == 'PDF') {
      this.$http({
        url: this.$http.adornUrl(`/common/fileShow/previewFile`),
        method: 'post',
        responseType: 'arraybuffer',
        params: this.$http.adornParams({fileUrl: this.url})
      }).then((res) => {
        loading.close()
        var blob = new Blob([res.data], {type: res.headers['content-type'] + ';charset=UTF-8'})
        let that = this
        let reader = new FileReader();
        reader.onload = function (event) {
          let content = reader.result;
          try {
            that.newWin = window.SITE_CONFIG.cdnUrl + '/static/pdf/web/viewer.html?file=' + URL.createObjectURL(blob) + '&name=' + encodeURIComponent(this.fileName)
          } catch (err) {
            let message = JSON.parse(content);
            if (message.code != 200) {
              that.$message.warning(message.msg);
            }
          }
        };
        reader.readAsText(blob)
        return true;
      })
    } else if (this.fileSuffix.toUpperCase() == 'DOC' || this.fileSuffix.toUpperCase() == 'DOCX') {
      this.$http({
        url: this.$http.adornUrl(`/common/fileShow/toHtml/${this.url}`),
        method: 'get',
        responseType: 'arraybuffer'
      }).then((res) => {
        loading.close()
        var blob = new Blob([res.data], {type: res.headers['content-type'] + ';charset=UTF-8'})
        let that = this
        let reader = new FileReader();
        reader.onload = function (event) {
          let content = reader.result;
          try {
            that.newWin = window.SITE_CONFIG.cdnUrl + '/static/pdf/web/viewer.html?file=' + URL.createObjectURL(blob) + '&name=' + encodeURIComponent(this.fileName)
          } catch (err) {
            let message = JSON.parse(content);
            if (message.code != 200) {
              that.$message.warning(message.msg);
            }
          }
        };
        reader.readAsText(blob)
        return true;
      })
    } else if (/\JPG|JPEG|PNG|BMP|GIF$/.test(this.fileSuffix.toUpperCase())) {
      this.$http({
        url: this.$http.adornUrl(`/common/fileShow/toHtml/${this.url}`),
        method: 'get'
      }).then((res) => {
        loading.close()
        this.imgSrc = 'data:image/' + this.fileSuffix + ';base64,' + res.data.msg;
      })
    }
  },
  mounted () {
    this.styleObject.height = `${document.documentElement.clientHeight - 3}px`;
    const that = this;
    window.onresize = function temp () {
      that.styleObject.height = `${document.documentElement.clientHeight - 3}px`;
    };
  }
}
</script>

<style lang="scss" scoped>
.html-wrap{
  padding: 0 30px;
  width: 100%;
  margin-bottom: 30px;
  margin-top: 30px;
  word-break:break-all;
  word-wrap: break-word;
}
</style>
```