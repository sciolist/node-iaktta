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
      output: { dir: `./dist/${name}`, format: 'cjs' },
      input: [
        `./src/iaktta.ts`
      ],
      plugins: [ minifier, ts() ].filter(v => v),
      external: [name]
    },
    {
      output: { file: `./dist/${name}/iaktta.d.ts`, format: 'es' },
      input: `./src/iaktta.ts`,
      plugins: [dts()],
      external: [name]
    }
  ];
}

export default [
  ...createConfiguration('preact')
]