# router-view-keep-alive
扩展vue3的keep-alive and router-view，可以自动判断是否需要使用缓存功能。
与router-view不同，该工具默认是不缓存页面内容，仅在router-view-keep-alive配置了cached为true值的情况下缓存指定页面。

你可以通过[vite-app-pro](https://github.com/deep-fish-pixel/create-vite-app) cli 创建模板项目，项目内置了keep-alive-router-view，方便体验和使用。

对vue2的支持[点击这里](https://github.com/deep-fish-pixel/keep-alive-vue2)

### 背景

当你项目中使用了keep-alive和router-view，好处是在下一个页面操作返回时快速恢复了上一步的操作状态，这样的体验非常好。

但是也有另外一个问题，需要清空页面缓存，就会比较麻烦。

router-view-keep-alive解决了这样问题，在你操作$router.back和$router.go默认使用使用缓存的页面，$router.push和$router.replace默认不使用缓存页面。

### 安装

```npm i router-view-keep-alive```

### 使用步骤

#### 第一步 引用并注册组件

```
import RouterViewKeepAlive from 'router-view-keep-alive';

Vue.use(RouterViewKeepAlive);
```

#### 第二步 使用router-view-keep-alive组件代替keep-alive和router-view

router-view-keep-alive内部封装了keep-alive和router-view，所以你只要写router-view-keep-alive组件元素。

cached属性，用来设置使用页面缓存。

##### Example1
```
<-- 推荐 -->
<router-view-keep-alive :cache="$route.meta.cache" />
```
##### Example2
```
<-- 默认使用缓存，用于带标签页管理器的项目 -->
<router-view-keep-alive
    :cache="!$route.meta || !$route.meta.noCache"
    :defaultCache="true" />
```

#### 第三步 必须使用vue-router实例的方法，只有在$router.go、$router.back调用后，才默认使用缓存页面。

### router-view-keep-alive属性说明

| 属性           | 说明                                                          | 类型   | 可选值 | 默认值   |
|--------------|-------------------------------------------------------------|------| --- |-------|
| cache        | 是否缓存页面                                                      | Boolean | true/false | false |
| defaultCache | 配置$router.push、$router.replace、$router.go(值大于0) cache参数使用的默认值 | Boolean | true/false | false |
| name         | router-view名称                                               | String | - | -     |
| include      | 只有名称匹配的组件会被缓存                                               | RegExp | - | -     |
| exclude      | 任何名称匹配的组件都不会被缓存                                             | RegExp | - | -     |
| max          | 最多可以缓存多少组件实例                                                | Number | - | -     |

### vue-router接口扩展

#### router.push/replace
push/replace接口展示的页面默认不缓存功能。如果需要使用，配置cache为true。
_注意defaultCache可改变默认缓存。_

```javascript
// 默认禁止缓存
router.push({
  name: 'list',
});
router.replace({
  name: 'list',
});

// 使用缓存
router.push({
  name: 'list',
  cache: true
});
router.replace({
  name: 'list',
  cache: true
});
```
#### router.back/forward/go
back接口展示的页面默认优先使用缓存的内容。如果禁止使用，配置cache为false
```javascript
// 默认使用缓存
router.back();
router.forward();
router.go(1);

// 禁止使用缓存
router.back({cache: false});
router.forward({cache: false});
router.go(1, {cache: false});
```

### router-view-keep-alive属性cache和router接口参数cache的值决定页面是否使用缓存
| router-view-keep-alive cache | router cache   | 是否使用缓存 |
|------------------|-----------------|--------|
| true             | true            | 是      |
| true             | false           | 否      |
| false            | true            | 否      |
| false            | false           | 否      |
两个cache值只有都为true，页面缓存生效。其他均不使用缓存页面。


