# router-view-keep-alive  [中文](./README-CH.md)
Extend vue3 keep-alive and router-view, add the function of automatically judging whether to use the cache.

You can use [vite-app-pro](https://github.com/deep-fish-pixel/create-vite-app) cli to create template project，keep-alive-router-view was built in project，convenient experience and use。

Support for vue2 [Click here](https://github.com/deep-fish-pixel/keep-alive-vue2)

### The background of the problem

If the page uses keep-alive and router-view, the advantage is that the operation state of the previous step is quickly restored when the next page operation returns, and this experience is very good.

But it also brings problems.

When the user enters the page from the navigation menu or breadcrumb, a brand new page is needed, but the cached page is actually used, and this result is not what we want.

router-view-keep-alive solves this problem.

It uses the cache when you operate router.back and router.go to return the page by default, and router.push and router.replace do not use the cache by default.

### Install

```npm i router-view-keep-alive```

### Steps for usage

#### First: import and register component

```
import RouterViewKeepAlive from 'router-view-keep-alive';

Vue.use(RouterViewKeepAlive);
```

#### Second: use router-view-keep-alive component replace keep-alive and router-view components

router-view-keep-alive encapsulates keep-alive and router-view internally,

so you only need to write the router-view-keep-alive component element.

The cache attribute is used to cache the use of page caching.

##### Example1
```
<-- Recommend -->
<router-view-keep-alive :cache="$route.meta.cache" />
```
##### Example2
```
<-- Use cache for items with tab manager -->
<router-view-keep-alive
    :cache="!$route.meta || !$route.meta.noCache"
    :defaultCache="true" />
```

#### Third: must use the method of the vue-router instance. Only after router.go and router.back are called, the cached page is used.

### router-view-keep-alive properties descriptions

| property | description                                                                                             | type | option | default |
| --- |---------------------------------------------------------------------------------------------------------| --- | --- |---------|
| cache | whether to cache page                                                                                   | Boolean  | true/false | false   |
| defaultCache | router.push、router.replace and router.go(value is greater than 0) parameter cache will use the value | Boolean | true/false | false |
| name | router-view name                                                                                        | String  | - | -       |
| include | only components with matching names will be cached                                                      | RegExp  | - | -       |
| exclude | any component whose name matches will not be cached                                                     | RegExp  | - | -       |
| max | maximum number of component instances that can be cached                                                | Number  | - | -       |

### vue-router interface extensions

#### router.push/replace

The page displayed by the push/replace interface does not use the cache function by default. If you need to use it, configure cache to true
_Note that defaultCache can change the default cache_

```javascript
// disable cache
router.push({
  name: 'list',
});
router.replace({
  name: 'list',
});

// use cache
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

The page displayed by the back/forward/go interface uses the cache function by default.
If not use cached page, configure cache to false

```javascript
// defaut use cache
router.back();
router.forward();
router.go(1);

// disable cache
router.back({cache: false});
router.forward({cache: false});
router.go(1, {cache: false});
```

### router-view-keep-alive attribute cache and router interface parameter cache values determine whether the page uses cache.
| router-view-keep-alive cache | router cache   | Whether to use cache |
|------------------|-----------------|----------------------|
| true             | true            | Yes                  |
| true             | false           | Not                  |
| false            | true            | Not                  |
| false            | false           | Not                  |
The page cache takes effect when both cache values are true. None of the others use cached pages.
