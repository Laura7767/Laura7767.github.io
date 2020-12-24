---
layout: post
title: "async和await的应用"
author: "Luo"
categories: [home,notes]
tags: [home,question,notes]
discription: 'async作为一个关键字放到函数前面，代表这个函数是一个异步函数'
image: cuba-1.jpg
---

##### 1. async的使用

async作为一个关键字放到函数前面，代表这个函数是一个异步函数，意思是说该函数的执行不会影响到后面代码的执行。

```
async function home () {
	return 'Hello!!!!!!!'
}
home();
console.log('我是异步函数后面的代码哦')
```

异步函数也是函数，按平时正常的函数调用使用。

打开控制台，上面的代码输出结果是：

```
我是异步函数后面的代码哦
>
```

异步函数没有返回结果，打印函数返回：

```
async function home () {
	return 'Hello!!!!!!!'
}
console.log(home())
console.log('我是异步函数后面的代码哦')
```

![](img/async/asyne_img_1.png)

可以看到异步函数返回的是一个promise对象，如果要获取promise的返回值，用以下两种方法可以获取：

async函数内部的实现原理是：如果async函数只有一个返回值时，调用该函数时，内部会调用Promise.resolve()方法把它转化成一个promi对象作为返回值，但如果async函数内部抛出错误，内部会调用Promise.reject()返回一个promise对象。

使用then、catch方法

```
代码：
home().then(result => {
	console.log(result)
})

结果:
我是异步函数后面的代码哦
Hello!!!!!!!


or


home().catch(err => {
	console.log(err)
})
```

##### 2. async和await的使用

适用场景：项目需要调用很多接口，有时候后面的接口需要前一个接口的返回结果，如果前一个接口挂了，后面的接口也不需要调用了

平时写法：

```
methods: {
    // 获取所属地
    getLocation(phoneNum) {
        return axois.post('/location', {phoneNum});
    },
    // 根据属地获取充值面额列表
    getFaceList(province, city) {
        return axois.post('/location', {province, city});
    },
    // 采取链式的调用方法
    getFaceResult() {
      this.getLocation(this.phoneNum)
          .then(res => {
              if (res.status === 200 && res.data.success) {
                  let province = res.data.province;
                  let city = res.data.city;
                  this.getFaceList(province, city)
                      .then(res => {
                          if(res.status === 200 && res.data.success) {
                              this.faceList = res.data
                          }
                      })
              }
          }).catch(err => {
              console.log(err)
          })  
    }
}
```
async/await写法:

```
methods: {
    // 获取所属地
    getLocation(phoneNum) {
        return axois.post('/location', {phoneNum});
    },
    // 根据属地获取充值面额列表
    getFaceList(province, city) {
        return axois.post('/location', {province, city});
    },
    // 采取async await 方式调用
    async getFaceResult() {
      // 异常需要通过try catch补货  
      try {
          let location = await this.getLocation(this.phoneNum);
          // 程序会等待上一个请求完成才进行下一条的语句执行
          
          if (location.data.success) {
              let province = location.data.province;
              let city = location.data.city;
              let result = await this.getFaceList(province, city);
              if (result.data.success) {
                  this.faceList = result.data;
              }
          }
      } catch(err) {
          console.log(err);
      }
    }
}


or


function doubleAfter2seconds(num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2 * num)
        }, 2000);
    } )
}
async function testResult() {
    let result = await doubleAfter2seconds(30);
    console.log(result);
}
testResult();

结果：2s后控制台显示 60
```


##### 3. 注意事项

1. `async` 和 `await` 基于 promise 的。 使用 async 的函数将会始终返回一个 promise 对象
2. 在使用 `await` 的时候我们暂停了函数，而非整段代码
3. `async` 和 `await` 是非阻塞的
4. 仍然可以使用 `Promise` 例如 `Promise.all()`
