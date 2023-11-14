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

export default wrapRouter;
