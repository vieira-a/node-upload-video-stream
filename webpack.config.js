const path = require('path');

module.exports = {
    entry: './public/compress.js', // Caminho para seu arquivo JavaScript de entrada
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), // Diretório de saída
    },
    mode: 'development', // Ou 'production' para otimização
};
