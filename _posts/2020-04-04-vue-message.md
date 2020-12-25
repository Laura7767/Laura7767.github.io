---
layout: post
title: "element-ui组件中的message显示问题"
author: "Luo"
categories: [home,question]
tags: [home,github,notes]
discription: '解决使用element-ui组件中的多个message显示无限下排问题'
image: cuba-4.jpg
---

#### vue异步调用造成的element-ui组件中的message显示问题 

1.重新构建message组件resetMessage

element-ui是动态往页面根节点插入message元素来实现弹框效果的，所以
/**重置message，防止重复点击重复弹出message弹框 */

```
import {Message} from 'element-ui';
let messageInstance = null;
const resetMessage = (options) => {
if(messageInstance) {
messageInstance.close()
}
messageInstance = Message(options)
};

['error','success','info','warning'].forEach(type => {
resetMessage[type] = options => {
if(typeof options === 'string') {
options = {
message:options
}
}
options.type = type
return resetMessage(options)
}
})

export const message = resetMessage
```

2.在main.js中引用重新构造的message组件

```

import {message} from '@/utils/resetMessage';

Vue.use(ElementUI)

Vue.prototype.$message = message;

```

注意：挂载自定义message必须放在Vue.use(ElementUI)后面，才能覆盖element-ui默认的message，不然没有效果
