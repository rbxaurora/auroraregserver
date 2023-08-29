const admin = require(`firebase-admin`);

const serviceAccount = require('./aurorareg-b787f-firebase-adminsdk-n41ax-e8f206552a.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

class Firebase {
	sendNotification(message){
		admin.messaging().send(message)
		.then((response) => {
			console.log('Succesfully sent message: ', response);
		})
		.catch((error) => {
			console.log('Error sending message: ', error);
		});
	}
};

module.exports = new Firebase();