const express = require(`express`);
const mongoose = require(`mongoose`);
const app = express();
require(`dotenv`).config();
const authRouter = require(`./routers/authRouter`);
const apiRouter = require(`./routers/apiRouter`);
const msgRouter = require('./routers/msgRouter');
const cors = require(`cors`);
const http = require(`http`).createServer(app);
const io = require(`socket.io`)(http, {
	cors: {
		origins: ['https://aurorareg.onrender.com']
	}
});
const { secret } = require(`./config.js`);

app.use(cors({ origin: 'https://aurorareg.onrender.com' }));

app.use(express.json());

const port = process.env.PORT || 3005;

http.listen(port, () => {
	console.log(`http://localhost:${port}`)
});

const Chat = require(`./models/Chat`);

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('online', async (data) => {
		await Chat.updateOne({ chatId: data.chatid }, { $push: {
			chatMembers: {
				$each: [`${data.username}`]
			}
		} });
		io.emit('online', data);
	})

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('message', async (data) => {
		await Chat.updateOne({ chatId: data.chatId }, { $push: {
			chatMessages: {
				type: 'message',
				from: data.from,
				date: data.date,
				message: data.message
			}
		} });
		io.emit('message', data);
	});

	socket.on('leave', async (data) => {
		await Chat.updateOne({ chatId: data.chatid }, { $push: {
			chatMembers: {
				$each: [ ],
				$slice: data.index
			}
		} });
		io.emit('leave', data);
	})
});

mongoose.connect(process.env.DB_PASS);


app.use('/auth', authRouter);
app.use('/api', apiRouter);
app.use('/msg', msgRouter);