import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import pkg from './package.json';

const input = 'src/index.ts';
const extensions = ['.ts'];

export default {
  input,
  output: [
    {
      file: `dist/${pkg.main}`,
      format: 'cjs',
    },
    {
      file: `dist/${pkg.module}`,
      format: 'es',
    },
    {
      file: `dist/${pkg.browser}`,
      format: 'umd',
      name: 'NetworkErrorFallback',
    },
    {
      file: `dist/${pkg['browser.min']}`,
      format: 'umd',
      name: 'NetworkErrorFallback',
      plugins: [terser()],
    },
  ],
  external: ['*.js'],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    json(),
    babel({
      extensions,
      include: ['src/**/*'],
      babelHelpers: 'bundled',
    }),
    copy({
      targets: [
        { src: 'src/sw.js', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
        { src: 'package.json', dest: 'dist' },
      ],
    }),
  ],
};
