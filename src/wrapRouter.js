const objectClass = Object;
// 解决跨微前端问题
objectClass.__keepAlive = true;

export default {
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
