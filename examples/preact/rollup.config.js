import serve from 'rollup-plugin-serve';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import buble from 'rollup-plugin-buble'
import path from 'path';

const minifier = terser({
  compress: {
    hoist_funs: true,
    module: true,
    passes: 3,
    warnings: true
  },
  toplevel: true
});

export default {
  input: 'src/index.mjs',
  output: { file: 'dist/bundle.js', format: 'umd' },
  plugins: [
    buble({ jsx: 'h', transforms: { forOf: false } }),
    minifier,
    serve('dist'),
    nodeResolve({ browser: true }),
    replace({ 'iaktta': path.resolve(__dirname, '../../dist/preact') })
  ]
}
