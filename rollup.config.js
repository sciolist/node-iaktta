import { terser } from 'rollup-plugin-terser';
import { ts, dts } from 'rollup-plugin-dts';
import replace from 'rollup-plugin-replace';

const minifier = terser({
  compress: {
    hoist_funs: true,
    module: true,
    passes: 3,
    warnings: true
  },
  output: {
    beautify: process.env.BEAUTIFY == '1'
  },
  toplevel: true
});

const buildPlugins = [
  ts(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  })
].filter(v => v);

export function createConfiguration(name) {
  return [
    {
      output: { dir: `./dist/${name}`, entryFileNames: '[name].js', format: 'cjs' },
      input: `./src/iaktta.ts`,
      plugins: buildPlugins,
      external: [name]
    },
    {
      output: { dir: `./dist/${name}`, entryFileNames: '[name].min.js', format: 'cjs' },
      input: `./src/iaktta.ts`,
      plugins: [...buildPlugins, minifier],
      external: [name]
    },
    {
      output: { dir: `./dist/${name}`, entryFileNames: '[name].mjs', format: 'es' },
      input: `./src/iaktta.ts`,
      plugins: buildPlugins,
      external: [name]
    },
    {
      output: { dir: `./dist/${name}`, entryFileNames: '[name].min.mjs', format: 'es' },
      input: './src/iaktta.ts',
      plugins: [...buildPlugins, minifier],
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
