import {
  createVNode,
  withCtx,
  openBlock,
  createBlock,
  resolveComponent,
  resolveDynamicComponent,
  KeepAlive,
  createCommentVNode
} from 'vue';
import wrapRouter from './wrapRouter';

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

    return createVNode(resolveComponent('router-view'), {
        name: this.name
      }, {
        default: withCtx(function ({ Component }) {
          return [
            (
              openBlock(),
              createBlock(
                KeepAlive,
                keepAliveProps,
                [
                  cache ? (openBlock(), createBlock(resolveDynamicComponent(Component), {
                      key: $route.fullPath
                    })) :
                    createCommentVNode("v-if", true)
                ],
                1032,
                ["include", "exclude", "max"]
              )
            ),
            !cache ? (
              openBlock(),
              createBlock(resolveDynamicComponent(Component), {
                key: $route.fullPath
              })
            ) : createCommentVNode("v-if", true)
          ];
        })
      },
      8,
      ["name"]
    );
  }
};

export default {
  install: (app) => {
    app.component(Main.name, Main);
    if(!app.config.globalProperties.$router){
      console.error('router-view-keep-alive should install after vue-router! Otherwise, it may cause partial failure.');
      return;
    }
    wrapRouter.wrap(app.config.globalProperties.$router);
  }
};
