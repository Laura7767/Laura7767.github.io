---
layout: post
title: "vue-simple-uploader分片上传"
author: "Luo"
categories: [home,notes]
tags: [home,question,notes]
discription: '使用vue-simple-uploader插件实现分片上传、秒传及断点续传的功能'
image: nature-1.jpg
---


## 9. vue分片上传

实现分片上传、秒传及断点续传的功能，使用vue-simple-uploader插件实现该功能

vue-simple-uploader是基于simple-uploader.js封装的vue上传插件。它的优点包括且不限于以下几种：

- 支持文件、多文件、文件夹上传；支持拖拽文件、文件夹上传
- 可暂停、继续上传
- 错误处理
- 支持“秒传”，通过文件判断服务端是否已存在从而实现“秒传”
- 分块上传
- 支持进度、预估剩余时间、出错自动重试、重传等操作

可以参考下面两个文档查看参数、函数等：

[vue-simple-uploader](https://github.com/Laura7767/vue-uploader/blob/main/README_zh-CN.md)

[simple-uploader](https://github.com/Laura7767/uploader/blob/main/README_zh-CN.md)

或参考文档：

[vue封装文件分片上传](https://www.cnblogs.com/xiahj/p/vue-simple-uploader.html)

##### 使用

```
npm install vue-simple-uploader --save
npm install spark-md5 --save
```

在main.js中引用：

```
import uploader from 'vue-simple-uploader'
Vue.use(uploader)
```

在项目文件中的引用：

```
<template>
	<div>
		<el-button type="text" size="small" @click="importEvidence(scope.row.id)">导入</el-button>

  		<el-dialog
    title = "上传证据"
    :visible.sync="evidenceDialogVisible"
    width="20%"
    :before-close="handleClose1">
<uploader :options="options" class="uploader-example" :autoStart="false" ref="uploader"
                    @file-added="fileAdded" @file-progress="onFileProgress" @file-success="onFileSuccess" @file-error="onFileError" @file-removed="onFileRemoved">
              <uploader-unsupport></uploader-unsupport>
              <uploader-drop>
              <uploader-btn ref="btn">选择证据包</uploader-btn>
            </uploader-drop>
            <uploader-list style="margin-top: 10px;" ref="uploader_list" id="uploader_list" v-loading="loading" element-loading-text="证据包添加中，请稍候..."></uploader-list>
            <el-button style="margin-top: 15px;" type="primary" @click="uploadAll" v-if="showFlag && this.caseFlag" :disabled="isDisabled">全部上传</el-button>
          </uploader>
		</el-dialog>
	</div>
</template>
```

script中使用：

```
<script>
import SparkMD5 from 'spark-md5'
export default {
  data () {
    return {
      caseFlag: false,
      // 导入证据包
      evidenceDialogVisible: false,
      evidenceParams: {},
      // 导入案件信息
      caseParams: {},
      caseName: '',
      caseFile: '',
      options: {
        // 可通过 https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js 示例启动服务
        target: this.$http.adornUrl('/sys/upload/chunkUpload'), // 目标上传 URL
        chunkSize: 5 * 1024 * 1024,   // 分块大小2M
        fileParameterName: 'file', // 上传文件时文件的参数名，默认file
        // maxChunkRetries: 3,  // 最大自动失败重试上传次数
        testChunks: true,  // 是否开启服务器分片校验
        simultaneousUploads: 50,
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function (chunk, message) {
          let objMessage = JSON.parse(message);
          if (objMessage.flag && !objMessage.flag) {
            return true;
          } else {
            return false
          }
          // let arr = []
          // if (objMessage.chunks && objMessage.chunks.length > 0) {
          //   for (let i = 0; i < objMessage.chunks.length; i++) {
          //     arr.push(objMessage.chunks[i].chunkNumber)
          //   }
          // }
          // return (arr || []).indexOf(chunk.offset + 1) >= 0
        },
        processResponse: function (response, cb) {
          let res = JSON.parse(response);
          if (res.code != 200) {
            Message.warning(res.msg)
            let flag = false
            cb(flag, response)
          } else {
            cb(null, response)
          }
        }
      },
      // isUploaded_zip: false,
      // notUploadedChunkNumbers_zip: [],
      // fileList: [],
      fileParams: {},
      packageParams: {
        identifier: '',
        fileName: '',
        chunks: '',
        totalSize: '',
        type: ''
      },
      caseIds: [],
      uploadFlag: false,
      curId: '',
      btnFlag: false,
      packageFileInfoList: [],
      suitFlag: false,
      showFlag: false,
      num: 0,
      isDisabled: false,
      fileNum: 0,
      loading: false,
      fileLength: 0,
      curNum: 0
    }
  },
  inject: ['reload'],
  computed: {
    uploader () {
      return this.$refs.uploader;
    }
  },
  methods: {
    // 批量上传
    uploadAll () {
      let btn = document.getElementsByClassName('uploader-file-resume')
      let _len = document.getElementsByClassName('uploader-file-resume').length;
      if (_len === this.num) {
        this.$message.warning('暂无可上传的文件！')
        return false;
      }
      for (let i = 0; i < _len; i++) {
        if (i != 0) {
          let timer = setTimeout(() => {
            btn[i].click()
            clearTimeout(timer)
          }, 50)
        } else {
          btn[i].click()
        }
      }
      this.isDisabled = true
    },
    // 上传单个文件
    fileAdded (file, event) {
      this.btnFlag = true
      // console.log(this.$refs.uploader, this.$refs.uploader_list)
      this.$nextTick(() => {
        this.fileLength = this.uploader.fileList.length
        if (!this.caseFlag && this.uploader.fileList.length > 1) {
          file.cancel()
          this.$message.warning('只能上传单文件！')
          return false
        }
      })
      if (/zip/gi.test(file.fileType) || file.name.indexOf('.zip') > -1 || /rar/gi.test(file.fileType) || file.name.indexOf('.rar') > -1 || /7z/gi.test(file.fileType) || file.name.indexOf('.7z') > -1) {
        this.loading = true
        this.computeMD5(file);  // 生成MD5
      } else {
        this.$message({message: '您上传的文件类型不正确，请上传.zip、.rar或.7z格式文件！', type: 'warning'});
        file.cancel();
        file.removeFile(file)
        return false;
      }
    },
    // 计算MD5值
    computeMD5 (file) {
      var that = this;
      // that.isUploaded_zip = false; // 这个文件是否已经上传成功过
      // that.notUploadedChunkNumbers_zip = []; // 未成功的chunkNumber
      var fileReader = new FileReader();
      let time = new Date().getTime();
      let md5 = '';
      file.pause();
      fileReader.readAsArrayBuffer(file.file);
      fileReader.onload = function (e) {
        if (file.size != e.target.result.byteLength) {
          that.$message.warning('文件读取失败!')
          return false;
        }
        md5 = SparkMD5.ArrayBuffer.hash(e.target.result, false) + time + file.id;
        // console.log(`MD5计算完毕：${file.id} ${file.name} MD5：${md5} 用时：${new Date().getTime() - time} ms`);
        file.uniqueIdentifier = md5;
        // 添加额外的参数
        // this.uploader.opts.query = {
        //   ...that.params
        // }
        that.$nextTick(() => {
          that.showFlag = true
          that.isDisabled = false
          that.fileNum += 1
          that.curNum += 1
          if (that.curNum == that.fileLength) {
            that.loading = false
          }
        })
      };
      fileReader.onerror = function () {
        that.$message.warning('异步读取文件出错了!')
        return false;
      };
    },
    // 文件移除
    onFileRemoved (file) {
      this.fileNum -= 1
      this.curNum -= 1
      if (this.curNum == this.num) {
        this.btnFlag = false
      }
      if (this.uploader.fileList.length == 0) {
        this.showFlag = false
      }
    },
    // 上传进度
    onFileProgress (rootFile, file, chunk) {
      // console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    // 上传成功
    onFileSuccess (rootFile, file, response, chunk) { // 内部自动调用
      let res = JSON.parse(response);
      if (res.code === 200) { //
        // if (this.isUploaded_zip) { // 不要也可，file.cancel()后就不会onFileSuccess()
        //   this.$message({ message: '该文件已经上传成功过了，不能再上传了哦。', type: 'success' });
        // } else {
        let type = ''
        if (file.name.toUpperCase().indexOf('.RAR') > -1) {
          type = '.rar'
        } else if (file.name.toUpperCase().indexOf('.ZIP') > -1 || file.fileType == 'application/zip') {
          type = 'application/zip'
        } else if (file.name.toUpperCase().indexOf('.7Z') > -1) {
          type = '.7z'
        }
        this.packageParams.identifier = file.uniqueIdentifier;
        this.packageParams.fileName = file.name
        this.packageParams.chunks = file.chunks.length
        this.packageParams.totalSize = file.size
        this.packageParams.type = type
        this.$http({
          url: this.$http.adornUrl('/sys/upload/mergeFile'),
          method: 'post',
          timeout: 300000,
          params: this.$http.adornParams(this.packageParams)
        }).then(({data}) => {
          this.btnFlag = false
          if (data && data.code === 200) {
            this.num += 1
            this.$message({ message: this.num + '个证据包上传成功！', type: 'success' });
            this.fileNum -= 1
            this.uploadFlag = true
            if (this.curNum == this.num) {
              this.btnFlag = false
            }
            if (!this.caseFlag) {
              this.fileParams = data.packageFile
            } else {
              this.packageFileInfoList.push(data.packageFile)
            }
          } else {
            file.cancel()
            this.$message({
              type: 'warning',
              showClose: true,
              duration: 20000,
              message: file.name + data.msg + '，请重新上传!'
            });
            if (!this.caseFlag) {
              this.btnFlag = true
            }
          }
        })
        // }
      } else {
        this.$message({ message: res.msg, type: 'warning' });
      }
    },
    onFileError (rootFile, file, response, chunk) {
      let res = JSON.parse(response);
      this.$message({
        message: res.msg,
        type: 'warning'
      })
      return false;
    },
    // 导入证据包
    importEvidence (id) {
      this.evidenceDialogVisible = true
      this.num = 0
      this.showFlag = false
      this.$nextTick(() => {
        window.uploader = this.$refs.uploader.uploader
        var time = setTimeout(() => {
          let uploadBtn = document.getElementsByClassName('uploader-btn')
          let btn = uploadBtn[0]
          this.$refs.uploader.uploader.assignBrowse(btn, false, true, {})
          clearTimeout(time)
        }, 100)
      })
    },
    submitEvidenceForm () {
      if (this.caseFlag && !this.caseName) {
        this.$message.warning('请导入案件信息！')
        return false
      }
      if (this.fileNum != 0) {
        this.$message.warning('证据包还有部分正在导入中，请稍候！')
        return false
      }
      this.btnFlag = true
      if (this.caseFlag) {
        let loading = Loading.service({
          lock: true,
          text: '案件导入中，请稍候...',
          background: 'rgba(256, 256, 256, 0.7)'
        });
        let param = new FormData(); // 创建form对象
        param.append('file', this.caseFile); // 通过append向form对象添加数据
        ....接口
      }
    },
    // 导入案件信息
    getCaseFuc () {
      this.caseFlag = true
      this.evidenceDialogVisible = true
      this.num = 0
      this.curNum = 0
      this.showFlag = false
      this.caseName = ''
      this.caseFile = ''
      this.$nextTick(() => {
        window.uploader = this.$refs.uploader.uploader
        var time = setTimeout(() => {
          let uploadBtn = document.getElementsByClassName('uploader-btn')
          let btn = uploadBtn[0]
          this.$refs.uploader.uploader.assignBrowse(btn, false, false, {})
          clearTimeout(time)
        }, 100)
      })
    },
    uploadCase () {
      document.getElementById('uploadCase').click()
    },
    getCase (e) {
      let file = e.target.files[0]
      // console.log(this.caseFile)
      // let param = new FormData(); // 创建form对象
      // param.append('file', this.caseFile); // 通过append向form对象添加数据
      // param.append('fileName', this.caseFile.name);
      if (file) {
        // console.log(this.caseFile.size)
        let type = file.name.indexOf('.xls') > -1 || file.name.indexOf('.xlsx') > -1
        if (type) {
          if (file.size < 12 * 1024 * 1024) {
            // this.$http.post(this.$http.adornUrl('/bankcase/caseinfo/batchImportCaseInfo'), param, {headers: {'Content-Type': 'multipart/form-data'}}).then(
            // ({data}) => {
            //   if (data && data.code === 200) {
            //     this.$message.success(data.msg)
            this.caseName = file.name
            this.caseFile = e.target.files[0];
            //   } else {
            //     this.$message.warning(data.msg)
            //   }
            document.getElementById('uploadCase').value = ''
            // })
          } else {
            this.$message.warning('上传文件大小不能超过12M，请重新上传')
            return false
          }
        } else {
          this.$message.warning('上传文件只能是.xls或.xlsx文件！')
          return false
        }
      }
    },
    handleClose1 () {
      this.caseName = ''
      this.caseFile = ''
      this.fileNum = 0
      this.curNum = 0
      this.fileLength = 0
      this.loading = false
      this.packageFileInfoList = []
      this.isDisabled = false
      if (this.$refs.uploader.fileList.length > 0) {
        this.reload()
        this.$refs.uploader = null
      }
    }
  }
}
</script>
```