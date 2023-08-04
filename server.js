const express = require(`express`);
const mongoose = require(`mongoose`);
const app = express();
require(`dotenv`).config();
const authRouter = require(`./routers/authRouter`);
const apiRouter = require(`./routers/apiRouter`);
const cors = require(`cors`);
const { secret } = require(`./config.js`);

app.use(cors({ origin: 'https://aurorareg.vercel.app' }));

app.use(express.json());

const port = process.env.PORT || 3005;

app.listen(port, () => {
	console.log(`http://localhost:${port}`)
});

mongoose.connect(process.env.DB_PASS);


app.use('/auth', authRouter);
app.use('/api', apiRouter);