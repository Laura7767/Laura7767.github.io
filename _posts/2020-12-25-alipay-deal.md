---
layout: post
title: "支付宝的处理"
author: "Luo"
categories: [home,notes]
tags: [home,question,notes]
discription: '记录支付宝的处理'
image: city-3.jpg
---

后端返回的是数据是 

```
<form name="punchout_form" method="post" action="https://openapi.alipaydev.com/gateway.do?charset=UTF-8&method=alipay.trade.page.pay&sign=UhEZF........&version=1.0&app_id=2016101800713295&sign_type=RSA2×tamp=2020-03-20+16%3A17%3A43&alipay_sdk=alipay-sdk-java-3.1.0&format=json"> <input type="hidden" name="biz_content" value="{"body":"具体订单的描述===可修改","out_trade_no":"TON2020032000052","product_code":"FAST_INSTANT_TRADE_PAY","subject":"某某某的订单名称===可修改","timeout_express":"10m","total_amount":"10000"}"> <input type="submit" value="立即支付" style="display:none" > </form> <script>document.forms[0].submit();</script>
```

不稳定（safrai页面会拦截）

```
let divForm = document.getElementsByClassName('recharge')
if (divForm.length) {
document.body.removeChild(divForm[0])
}
const div = document.createElement('div');
div.setAttribute('class', 'recharge')
div.innerHTML = data.payPage;
document.body.appendChild(div);
document.forms[0].setAttribute('target','_blank')
document.forms[0].submit();

var newwindow = window.open('#', '_blank');
 newwindow.document.write(data.payPage);

```

稳定版本

1. 操作

```
let newpage = this.$router.resolve({
            name: 'chargeInfo',
            query: {i: encodeURIComponent(JSON.stringify(this.params))}
          })
          window.open(newpage.href, '_blank')
```

2. 处理页面

```
<template>
  <div>
    <div style="padding: 30px">前往支付中，请稍后...</div>
    <div v-html="alipayWap" ref="alipayWap" style="display: none"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      alipayWap: '',
      params: {}
    }
  },
  created () {
    this.params = JSON.parse(decodeURIComponent(this.$route.query.i))
    this.$http({
      url: this.$http.adornUrl('/apipay'),
      method: 'post',
      data: this.$http.adornParams(this.params)
    }).then(({data}) => {
      if (data && data.code === 0) {
        localStorage.setItem('order', data.orderNum)
        this.alipayWap = data.payPage
        this.$nextTick(() => {
          this.$refs.alipayWap.children[0].submit()
        })
      } else {
        this.$message.warning(data.msg)
      }
    })
  },
  methods: {
  }
}
</script>
```