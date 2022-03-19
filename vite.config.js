const path = require('path')
import glslifyCompiler from 'vite-plugin-glslify'

export default {
    plugins: [
      glslifyCompiler()
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'js/script.js'),
            name: 'p5shader',
            fileName: (format) => `p5shader.${format}.js`
        },
        rollupOptions: {
        }
    }
  };
