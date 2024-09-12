// const admin = require('firebase-admin');
// const serviceAccount = require('../Firebase.json');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://mobilityplanningapp.firebaseio.com'
//   });
// module.exports = {

// sendDriverRequestNotification() {
//     const message = {
//       notification: {
//         title: 'New Driver Request',
//         body: 'A new driver has registered on the platform.',
//       },
//       topic: 'admin',
//     };
  
//     try {
//        admin.messaging().send(message);
//       console.log('Notification sent to admin');
//     } catch (error) {
//       console.error('Error sending notification:', error);
//     }
//   }}