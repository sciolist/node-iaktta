import { terser } from 'rollup-plugin-terser';
import { ts, dts } from "rollup-plugin-dts";

const files = [
  'index',
  'helpers/preact',
  'helpers/react',
  'helpers/autorun'
]

export default [
  {
    output: { dir: 'dist', format: 'cjs' },
    input: files.reduce((a, b) => {
      a[b] = `./src/${b}.ts`;
      return a;
    }, {}),
    plugins: [ 
      ts(),
      process.env.MINIFY && terser({
        compress: {
          pure_getters: true,
          module: true
        },
        module: true,
        toplevel: true
      }),
    ].filter(v => v),
    external: ['preact', 'react']
  },
  ...files.map(f => ({
    output: { file: `./dist/${f}.d.ts`, format: 'es' },
    input: `./src/${f}.ts`,
    plugins: [dts()]
  }))
]