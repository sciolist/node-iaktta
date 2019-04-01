import { terser } from 'rollup-plugin-terser';
import { ts, dts } from 'rollup-plugin-dts';
import replace from 'rollup-plugin-replace';

const minifier =
  process.env.MINIFY &&
  terser({
    compress: {
      pure_getters: true,
      module: true
    },
    output: {
      beautify: process.env.BEAUTIFY=="1"
    },
    module: true,
    toplevel: true
  });

const buildPlugins = [
  minifier,
  ts(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  })
].filter(v => v);

export function createConfiguration(name) {
  return [
    {
      output: { file: `./dist/${name}/iaktta.js`, format: 'cjs' },
      input: `./src/iaktta.ts`,
      plugins: buildPlugins,
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

export default [...createConfiguration('preact')];
