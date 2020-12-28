---
layout: post
title: "辑器tinymce及UEditor的使用"
author: "Luo"
categories: [home,notes]
tags: [home,question,notes]
discription: '编辑器tinymce及UEditor的引用、配置及使用'
image: nature-1.jpg
---

## 编辑器tinymce及UEditor

vue项目中用到过两个编辑器，一个是tinymce和UEditor,tinymce兼容性不高。。IE11及以上版本才能使用，而UEditor兼容性高些。。。IE7.8都能用。。

tinymce的兼容性如下：

![img]({{ site.github.url }}/assets/img/tinymce.png)

##### 1. tinymce的使用及配置

引入：

```
  import tinymce from 'tinymce/tinymce'
  import Editor from '@tinymce/tinymce-vue'
  import 'tinymce/themes/silver'
  import 'tinymce/icons/default/icons'
  import 'tinymce/plugins/paste'
  import 'tinymce/plugins/anchor'
  import 'tinymce/plugins/print'
  import 'tinymce/plugins/table'
  import 'tinymce/plugins/link'
  import 'tinymce/plugins/code'
  import 'tinymce/plugins/lists'
  import 'tinymce/plugins/contextmenu'
  import 'tinymce/plugins/wordcount'
  import 'tinymce/plugins/textcolor'
  
  
  components: {
	Editor
  },
  mounted () {
  	tinymce.init({})
  }
```

页面中使用：

```
<Editor id="tinymce" v-model="htmlContent" :init="init"></Editor>
```

配置：

```
data(){
    return{
		htmlContent: '',
        init: {
          language_url: window.SITE_CONFIG.cdnUrl + '/static/tinymce/langs/zh_CN.js', // 如果语言包不存在，指定一个语言包路径
          language: 'zh_CN', // 语言
          skin_url: window.SITE_CONFIG.cdnUrl + '/static/tinymce/skins/ui/oxide', // 如果主题不存在，指定一个主题路径
          content_css: window.SITE_CONFIG.cdnUrl + '/static/tinymce/skins/content/default/content.css',
          plugins: 'link lists wordcount code print textcolor table',
          toolbar: [
            'undo redo | fontsizeselect forecolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table removeformat print | savebutton downloadbutton signbutton'
          ],
          height: '500px',
          branding: false, // 技术支持(Powered by Tiny || 由Tiny驱动)
          theme: 'silver', // 主题
          zIndex: 1101
        }
    }
}
```

插入标签：

```
insertLabel (file) {
	let value = '{' + file.filedName + '}'
	tinymce.execCommand('mceInsertContent', false, value)
}
```

操作：

```
// 聚焦
tinymce.editors[0].editorManager.get('tinymce').focus();
// 编辑和不可编辑操作
tinymce.get('tinymce').getBody().setAttribute('contenteditable', true);
```

##### 2. UEditor的使用和配置

引入：

```
<script src="./static/plugins/ueditor-1.4.3.3/ueditor.config.js"></script>
<script src="./static/plugins/ueditor-1.4.3.3/ueditor.all.min.js"></script>
<script src="./static/plugins/ueditor-1.4.3.3/lang/zh-cn/zh-cn.js"></script>
<!-- 如果要有自定义标注功能，引入以下文件 -->
<script src="./static/plugins/ueditor-1.4.3.3/customize/postilPlugin.js"></script>
<script src="./static/plugins/ueditor-1.4.3.3/customize/newPostilDialog.js"></script>
<script src="./static/plugins/ueditor-1.4.3.3/customize/displayPostil.js"></script>
```

文件见 .../img/ueditor-1.4.3.3

页面中使用：

```
<div id="ueditor-wrap">
	<script id="J_ueditorBox" class="ueditor-box" type="text/plain" style="width: 100%; height: 600px;"></script>
</div>
```

配置：

```
<script>
import ueditor from 'ueditor'
export default {
  data () {
    return {
      htmlContent: '',
      ue: null,
      config: {
        zIndex: 800,
        toolbars: [
          [ 'source', 'undo', 'redo', 'fontfamily', 'fontsize', 'forecolor', 'backcolor', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
            'insertorderedlist', 'insertunorderedlist',
            'customstyle', 'paragraph', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', 'indent', '|',
            'inserttable', 'removeformat', 'formatmatch', 'autotypeset', 'selectall', 'cleardoc', 'blockquote', 'pasteplain'
          ]
        ],
        autoHeightEnabled: false,
        elementPathEnabled: false,
        wordCountMsg: '当前已输入{#count}个字符&nbsp;&nbsp;',
        allowDivTransToP: false
      }
    }
  },
  beforeDestroy () {
    this.resetEditor()
  },
  created () {
    this.getUedito()
  },
  methods: {
    // 编辑器初始化
    getUeditor (html) {
      if (document.getElementById('ueditor-wrap') && !document.getElementById('ueditor-wrap').innerHTML) {
        document.getElementById('ueditor-wrap').innerHTML = `<script id="J_ueditorBox" class="ueditor-box" type="text/plain" style="width: 100%; height: 430px;"><\/script>`
      }
      this.$nextTick(() => {
        this.ue = ueditor.getEditor('J_ueditorBox', this.config)
        let that = this;
        this.ue.ready(function() {
          // that.ue.setContent(html);
          that.ue.setContent(html, false)
          // that.ue.execCommand('insertHtml', html)
        });
      })
    },
    resetEditor () {
      if (this.ue) {
        this.ue.destroy()
        this.ue = null
      }
      let arr = document.getElementById('J_ueditorBox')
      let id = document.getElementById('edui_fixedlayer')
      if (arr) {
        if (this.isIE() || this.isIE11()) {
          arr.removeNode(true);
        } else {
          arr.remove()
        }
      }
      if (id) {
        if (this.isIE() || this.isIE11()) {
          id.removeNode(true);
        } else {
          id.remove()
        }
      }
    },
    isIE () {
      if (!!window.ActiveXobject || 'ActiveXObject' in window) {
        return true;
      } else {
        return false;
      }
    },
    isIE11 () {
      if ((/Trident\/7\./).test(navigator.userAgent)) {
        return true;
      } else {
        return false;
      }
    }
  }
}
</script>
```

UEditor操作：

```
<!-- 获取内容 -->
    <div class="btn-wrap" style="margin-top: 30px">
        <el-button @click="getContent()">获得内容</el-button>
        <el-button @click="getAllHtml()">获得整个html的内容</el-button>
        <el-button @click="setContent()">写入内容</el-button>
        <el-button @click="setContent(true)">追加内容</el-button>
        <el-button @click="getContentTxt()">获得纯文本</el-button>
        <el-button @click="getPlainTxt()">获得带格式的纯文本</el-button>
        <el-button @click="hasContent()">判断是否有内容</el-button>
        <el-button @click="setFocus()">使编辑器获得焦点</el-button>
        <el-button @mousedown="isFocus(event)">编辑器是否获得焦点</el-button>
        <el-button @mousedown="setblur(event)" >编辑器失去焦点</el-button>

    </div>
    <div class="btn-wrap">
        <el-button @click="getText()">获得当前选中的文本</el-button>
        <el-button @click="insertHtml()">插入给定的内容</el-button>
        <el-button id="enable" @click="setEnabled()">可以编辑</el-button>
        <el-button @click="setDisabled()">不可编辑</el-button>
        <el-button @click="ue.setHide()">隐藏编辑器</el-button>
        <el-button @click="ue.setShow()">显示编辑器</el-button>
        <el-button @click="ue.setHeight(300)">设置高度为300默认关闭了自动长高</el-button>
    </div>

    <div class="btn-wrap" style="margin-bottom: 40px">
        <el-button @click="getLocalData()" >获取草稿箱内容</el-button>
        <el-button @click="clearLocalData()" >清空草稿箱</el-button>
    </div>
```

对应操作：

```
// 获得内容
      getContent () {
        this.dialogVisible = true
        this.ue.ready(() => {
          this.ueContent = this.ue.getContent()
        })
      },
      // 获得整个html的内容
      getAllHtml () {
        this.dialogVisible = true
        this.ue.ready(() => {
          this.ueContent = this.ue.getAllHtml()
        })
      },
      // 追加内容
      setContent (isAppendTo) {
        this.ue.ready(() => {
          this.ue.setContent('欢迎使用ueditor', isAppendTo)
        })
      },
      // 获取纯文本内容
      getContentTxt () {
        this.dialogVisible = true
        this.ue.ready(() => {
          this.ueContent = this.ue.getContentTxt()
        })
      },
      // 获取带格式的纯文本内容
      getPlainTxt () {
        this.dialogVisible = true
        this.ue.ready(() => {
          this.ueContent = this.ue.getPlainTxt()
        })
      },
      // 判断是否有内容
      hasContent () {
        this.dialogVisible = true
        this.ue.ready(() => {
          this.ueContent = this.ue.hasContents()
        })
      },
      // 使编辑器获取焦点
      setFocus () {
        this.ue.ready(() => {
          this.ue.focus()
        })
      },
      // 编辑器是否获得焦点
      isFocus (e) {
        this.dialogVisible = true
        this.ue.ready(() => {
          console.log(this.ue.isFocus())
          this.ueContent = this.ue.isFocus()
          this.ue.dom.domUtils.preventDefault(e)
        })
      },
      // 失去焦点
      setblur (e) {
        this.ue.ready(() => {
          this.ue.blur()
          this.ue.dom.domUtils.preventDefault(e)
        })
      },
      // 获取当前选中的文本
      getText () {
        // 当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
        this.dialogVisible = true
        this.ue.ready(() => {
          var range = this.ue.selection.getRange();
          range.select();
          this.ueContent = this.ue.selection.getText();
        })
      },
      // 插入给定的内容
      insertHtml () {
        var value = prompt('插入html代码', '');
        this.ue.execCommand('insertHtml', value)
      },
      setDisabled () {
        this.ue.setDisabled('fullscreen');
        // this.disableBtn('enable');
      },
      setEnabled () {
        this.ue.setEnabled();
        // this.enableBtn();
      },
      disableBtn (str) {
        this.ue.ready(() => {
          var range = this.ue.selection.getRange();
          range.select();
          this.ueContent = this.ue.selection.getText();
          console.log(this.ue)
        })
        var div = document.getElementById('btns');
        var btns = this.ue.dom.domUtils.getElementsByTagName(div, 'button');
        for (var i = 0; i < btns.lenght; i++) {
          let btn = btns[i]
          if (btn.id == str) {
            this.ue.dom.domUtils.removeAttributes(btn, ['disabled']);
          } else {
            btn.setAttribute('disabled', 'true');
          }
        }
      },
      enableBtn () {
        var div = document.getElementById('btns');
        console.log(this.ue)
        console.log(this.ue.dom)
        var btns = this.ue.dom.domUtils.getElementsByTagName(div, 'button');
        for (var i = 0; i < btns.lenght; i++) {
          let btn = btns[i]
          this.ue.dom.domUtils.removeAttributes(btn, ['disabled']);
        }
      },
      getLocalData () {
        this.dialogVisible = true
        this.ue.ready(() => {
          this.ueContent = this.ue.execCommand('getlocaldata')
        })
      },
      clearLocalData () {
        this.ue.execCommand('clearlocaldata');
      }
```
