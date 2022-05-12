'use strict';

var vue = require('vue');

const objectClass = Object;
// 解决跨微前端问题
objectClass.__keepAlive = true;

var wrapRouter = {
  getKeepAlive() {
    return objectClass.__keepAlive;
  },
  setKeepAlive(useKeepAlive) {
    objectClass.__keepAlive = useKeepAlive;
  },
  wrap(router) {
    const { push, go } = router;

    router.push = function(...args) {
      const location = args[0];

      if (location && typeof location.keepAlive === 'boolean') {
        objectClass.__keepAlive = location.keepAlive;
      } else {
        objectClass.__keepAlive = false;
      }
      return push.apply(this, args);
    };
    router.back = function(options) {
      if (options && typeof options.keepAlive === 'boolean') {
        objectClass.__keepAlive = options.keepAlive;
      }
      return go.apply(this, [-1]);
    };
    router.go = function(num, options) {
      if (num > 0) {
        objectClass.__keepAlive = false;
      }
      if (options && typeof options.keepAlive === 'boolean') {
        objectClass.__keepAlive = options.keepAlive;
      }
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
    disabled: Boolean
  },
  data() {
    return {
      hasDestroyed: false,
      current: null,
    };
  },

  methods: {
    before(to, from, next) {
      if (this.hasDestroyed) {
        return next();
      }
      const keepAlive = this.$refs.keepAlive;
      if (!wrapRouter.getKeepAlive() && to.meta.keepAlive) {
        const cache = keepAlive && keepAlive.$ && keepAlive.$.__v_cache;
        if (cache) {
          this.current = cache.get(to.name);
          if (this.current) {
            cache.delete(to.name);
          }
        }
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
    }
  },

  created() {
    wrapRouter.wrap(this.$router);
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
    const isCached = !this.disabled;

    return vue.createVNode(vue.resolveComponent('router-view'), {
        name: this.name
      }, {
        default: vue.withCtx(function ({ Component }) {
          return [(vue.openBlock(), vue.createBlock(vue.KeepAlive, keepAliveProps, [isCached ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(Component), {
              key: $route.name
            })) : vue.createCommentVNode("v-if", true)], 1032
            , ["include", "exclude", "max"])), !isCached ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(Component), {
            key: $route.name
          })) :vue.createCommentVNode("v-if", true)];
        })
      }, 8
      , ["name"]);
  }
};

var main = {
  install: (app) => {
    app.component(Main.name, Main);
  }
};

module.exports = main;
