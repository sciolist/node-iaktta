import { terser } from 'rollup-plugin-terser';
import { ts, dts } from "rollup-plugin-dts";

const minifier = process.env.MINIFY && terser({
  compress: {
    pure_getters: true,
    module: true
  },
  module: true,
  toplevel: true
});

export function createConfiguration(name) {
  return [
    {
      output: { file: `./dist/${name}/iaktta.js`, format: 'cjs' },
      input: `./src/iaktta.${name}.ts`,
      plugins: [ minifier, ts(), minifier ].filter(v => v),
      external: [name]
    },
    {
      output: { file: `./dist/${name}/iaktta.d.ts`, format: 'es' },
      input: `./src/iaktta.${name}.ts`,
      plugins: [dts()],
      external: [name]
    }
  ];
}

export default [
  ...createConfiguration('preact'),
  ...createConfiguration('react')
]