let keepAlive = true;

export default {
  getKeepAlive() {
    return keepAlive;
  },
  setKeepAlive(useKeepAlive) {
    keepAlive = useKeepAlive;
  },
  wrap(router) {
    const { push, go } = router;

    router.push = function(...args) {
      const location = args[0];

      if (location && typeof location.keepAlive === 'boolean') {
        keepAlive = location.keepAlive;
      } else {
        keepAlive = false;
      }
      return push.apply(this, args);
    };
    router.back = function(options) {
      if (options && typeof options.keepAlive === 'boolean') {
        keepAlive = options.keepAlive;
      }
      return go.apply(this, [-1]);
    };
    router.go = function(num, options) {
      if (num > 0) {
        keepAlive = false;
      }
      if (options && typeof options.keepAlive === 'boolean') {
        keepAlive = options.keepAlive;
      }
      return go.apply(this, [num]);
    };
  }
};
