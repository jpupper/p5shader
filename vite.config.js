const path = require('path')
import ViteRestart from 'vite-plugin-restart';

export default {
//    plugins: [
//      ViteRestart({
//        reload: [
//            './shaders/**/*',
//        ]
//      })
//    ],
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
