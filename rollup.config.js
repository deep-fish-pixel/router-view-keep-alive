// const uglify = require('rollup-plugin-uglify');

export default {
  input: 'src/main.js',
  output: {
    file: 'lib/main.js',
    format: 'cjs'
  },
  plugins: [
    // uglify.uglify(),
  ]
};
