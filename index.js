const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const imageToBase64 = require('image-to-base64');

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, }));

app.get('/', (req, resp) => {
    resp.json({ ok: true, message: 'Hello World' });
});

//Guardar archivo de forma local
app.post('/upload/image', (req, resp) => {
    const pago = req.files.pago;
    pago.mv(`./pagos/${pago.name}`, (error) => {
        if (error) {
            resp.status(500).json({ ok: false, message: 'Tu pago no ha sido guardado' });
        } else {
            resp.json({ ok: true });
        }
    });
});

//Regresar imagen por archivo

app.get('/images/:nameFile', (req, resp) => {
    const nameFile = req.params.nameFile;
    if (fs.existsSync(`./pagos/${nameFile}`)) {
        resp.sendFile(`${__dirname}/pagos/${nameFile}`);
    } else {
        resp.status(404).json({ ok: false, mesagge: 'Recurso no encontrado' })
    }
});


// regresar imagen por base64

app.get('/images/base64/file', (req, resp) => {
    const file = fs.readFileSync('./image.txt', 'base64');
    const img = Buffer.from(file, 'base64');
    resp.setHeader('Content-type', 'image/png');
    resp.setHeader('Content-Length', img.length);
    resp.end(img);
});


//Guardar imagen como base64
app.post('/upload/image/base64', (req, resp) => {
    const pago = req.files.pago;
    console.log(pago);
    const buffer = fs.readFileSync(pago.tempFilePath);
    const base64 = buffer.toString('base64');
    fs.writeFileSync('image.txt', base64, 'base64');
    resp.json({ ok: true, base64 });
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});