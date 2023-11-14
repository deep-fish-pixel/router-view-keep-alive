'use strict';

var vue = require('vue');

const objectClass = Object;
// 解决通讯问题
objectClass.__keepAlive = true;
var defaultCache = false;

const wrapRouter = {
  getDefaultCached() {
    return defaultCache;
  },
  setDefaultCached(value) {
    defaultCache = value;
  },
  getKeepAlive() {
    return objectClass.__keepAlive;
  },
  setKeepAlive(useKeepAlive) {
    objectClass.__keepAlive = useKeepAlive;
  },
  wrap(router) {
    const { push, replace, go } = router;

    function checkSetCache(location) {
      return location && (typeof location.cache === 'boolean' || typeof location.keepAlive === 'boolean');
    }

    function setCache(location) {
      if (location && typeof location.cache === 'boolean') {
        wrapRouter.setKeepAlive(location.cache);
      } else if (location && (typeof location.keepAlive === 'boolean')) {
        wrapRouter.setKeepAlive(location.keepAlive);
      }
    }

    router.push = function(...args) {
      const location = args[0];

      if (checkSetCache(location)) {
        setCache(location);
      } else {
        wrapRouter.setKeepAlive(wrapRouter.getDefaultCached());
      }
      return push.apply(this, args);
    };
    router.replace = function(...args) {
      const location = args[0];

      if (checkSetCache(location)) {
        setCache(location);
      } else {
        wrapRouter.setKeepAlive(wrapRouter.getDefaultCached());
      }
      return replace.apply(this, args);
    };
    router.back = function(options = { cache: true }) {
      wrapRouter.setKeepAlive(!!options.cache);
      return go.apply(this, [-1, { cache: !!options.cache }]);
    };
    router.forward = function(options = { cache: true }) {
      wrapRouter.setKeepAlive(!!options.cache);
      return go.apply(this, [1, { cache: !!options.cache }]);
    };
    router.go = function(num, options = { cache: true }) {
      wrapRouter.setKeepAlive(!!options.cache);
      return go.apply(this, [num]);
    };
  }
};

const Main = {
  name: 'RouterViewKeepAlive',
  props: {
    include: RegExp,
    exclude: RegExp,
    max: Number,
    name: String,
    cache: Boolean,
    defaultCache: Boolean,
  },
  data() {
    wrapRouter.setDefaultCached(this.defaultCache);
    return {
      hasDestroyed: false,
      current: null,
      firstLoadPage: true,
    };
  },
  methods: {
    before(to, from, next) {
      if (this.hasDestroyed) {
        return next();
      }
      if (!wrapRouter.getKeepAlive()) {
        this.deleteCache(to);
      }
      next();
    },
    after() {
      if (this.hasDestroyed) {
        return true;
      }
      setTimeout(() => {
        wrapRouter.setKeepAlive(true);
      }, 10);
    },
    deleteCache(router){
      const keepAlive = this.$refs.keepAlive;
      const vCache = keepAlive && keepAlive.$ && keepAlive.$.__v_cache;
      if (vCache) {
        this.current = vCache.get(router.fullPath);
        if (this.current) {
          vCache.delete(router.fullPath);
        }
      }
    }
  },

  created() {
    this.$router.beforeEach(this.before);
    this.$router.afterEach(this.after);
  },
  destroyed() {
    this.hasDestroyed = true;
  },
  render() {
    const keepAliveProps = {
      include: this.include,
      exclude: this.exclude,
      max: this.max,
      ref: 'keepAlive'
    };
    const $route = this.$route;
    const cache = this.cache;
    if (!cache) {
      this.deleteCache($route);
    }

    return vue.createVNode(vue.resolveComponent('router-view'), {
        name: this.name
      }, {
        default: vue.withCtx(function ({ Component }) {
          return [
            (
              vue.openBlock(),
              vue.createBlock(
                vue.KeepAlive,
                keepAliveProps,
                [
                  cache ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(Component), {
                      key: $route.fullPath
                    })) :
                    vue.createCommentVNode("v-if", true)
                ],
                1032,
                ["include", "exclude", "max"]
              )
            ),
            !cache ? (
              vue.openBlock(),
              vue.createBlock(vue.resolveDynamicComponent(Component), {
                key: $route.fullPath
              })
            ) : vue.createCommentVNode("v-if", true)
          ];
        })
      },
      8,
      ["name"]
    );
  }
};

var main = {
  install: (app) => {
    app.component(Main.name, Main);
    if(!app.config.globalProperties.$router){
      console.error('router-view-keep-alive should install after vue-router! Otherwise, it may cause partial failure.');
      return;
    }
    wrapRouter.wrap(app.config.globalProperties.$router);
  }
};

module.exports = main;
