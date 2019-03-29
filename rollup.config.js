import { terser } from 'rollup-plugin-terser';
import { ts, dts } from "rollup-plugin-dts";

const files = [
  'iaktta',
  'helpers/preact',
  'helpers/react',
  'helpers/autorun'
]

const minifier = process.env.MINIFY && terser({
  compress: {
    pure_getters: true,
    module: true
  },
  module: true,
  toplevel: true
});

export default [
  {
    output: [
      { dir: 'dist', format: 'cjs', entryFileNames: '[name].js' },
    ],
    input: files.reduce((a, b) => {
      a[b] = `./src/${b}.ts`;
      return a;
    }, {}),
    plugins: [ minifier, ts() ].filter(v => v),
    external: ['preact', 'react']
  },
  ...files.map(f => ({
    output: { file: `./dist/${f}.d.ts`, format: 'es' },
    input: `./src/${f}.ts`,
    plugins: [dts()],
    external: ['preact', 'react']
  }))
]