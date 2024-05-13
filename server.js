require('dotenv').config();
const express = require('express');
const cors = require('cors');
const monitorarRecursos = require('./resources')

const multer = require('multer');
const s3Client = require('./aws.config');
const stream = require('stream');
const path = require('path');
const { Upload } = require('@aws-sdk/lib-storage');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});


const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));

const upload = multer();
app.use(express.static('public')); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/videos/upload', upload.array('file'), async (req, res) => {
    console.log('Requisição recebida');
    console.log('Headers:', req.headers);
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    try {
        // Verifique se algum arquivo foi recebido
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Nenhum arquivo recebido' });
        }

        // Lista para armazenar os URLs dos arquivos enviados
        const urls = [];

        // Processamento de upload dos arquivos recebidos
        for (const file of req.files) {
            console.log(`Processando arquivo: ${file.originalname}`);

            // Criar um PassThrough Stream para o upload
            const passThroughStream = new stream.PassThrough();
            passThroughStream.end(file.buffer);

            // Configuração do Upload
            const uploader = new Upload({
                client: s3Client,
                params: {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: file.originalname,  // Usando o nome personalizado do cliente
                    Body: passThroughStream,
                    ContentType: file.mimetype,
                },
            });

            // Realizar o upload para o S3
            const result = await uploader.done();

            // Adicionar o URL do arquivo à lista de URLs
            urls.push(`https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${file.originalname}`);
        }

        console.log(urls)

        // Responder com os URLs dos arquivos enviados
        res.json({ url: [urls] });
    } catch (error) {
        console.error('Upload falhou:', error);
        res.status(500).send('Upload falhou');
    }
});

monitorarRecursos()

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
