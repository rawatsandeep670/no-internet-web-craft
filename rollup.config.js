import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import pkg from './package.json';

const input = 'src/index.ts';
const extensions = ['.ts'];

export default {
  input,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'CallApp',
    },
  ],
  external: ['*.js'],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({
      extensions,
      include: ['src/**/*'],
      babelHelpers: 'bundled',
    }),
    copy({
      targets: [{ src: 'src/sw.js', dest: 'dist' }],
    }),
  ],
};
