import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';


export default [
  {
    output: {
      dir: 'dist',
      format: 'cjs'
    },
    input: {
      'index': './src/index.ts',
      'helpers/preact': './src/helpers/preact.ts',
      'helpers/react': './src/helpers/react.ts',
      'helpers/autorun': './src/helpers/autorun.ts',
    },
    plugins: [
      typescript(),
      terser(),
    ],
    external: ['preact', 'react']
  }
]