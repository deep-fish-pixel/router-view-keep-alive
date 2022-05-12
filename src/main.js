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

    return createVNode(resolveComponent('router-view'), {
        name: this.name
      }, {
        default: withCtx(function ({ Component }) {
          return [(openBlock(), createBlock(KeepAlive, keepAliveProps, [isCached ? (openBlock(), createBlock(resolveDynamicComponent(Component), {
              key: $route.name
            })) : createCommentVNode("v-if", true)], 1032
            , ["include", "exclude", "max"])), !isCached ? (openBlock(), createBlock(resolveDynamicComponent(Component), {
            key: $route.name
          })) :createCommentVNode("v-if", true)];
        })
      }, 8
      , ["name"]);
  }
};

export default {
  install: (app) => {
    app.component(Main.name, Main);
  }
};
