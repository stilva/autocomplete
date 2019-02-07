import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import {terser} from "rollup-plugin-terser";

export default {
  input: 'src/index.js',
  output: [
    {
      file: './dist/autocomplete.js',
      format: 'iife',
      name: 'Autocomplete',
      globals: {
        preact: 'preact'
      }
    },
    {
      file: './dist/autocomplete.cjs.js',
      format: 'cjs',
    }
  ],
  external: ['preact'],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    terser()
  ],
  watch: {
    include: 'src/**'
  }
};
