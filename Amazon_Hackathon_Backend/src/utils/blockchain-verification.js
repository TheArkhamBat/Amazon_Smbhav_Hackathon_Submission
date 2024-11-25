// import crypto from 'crypto';

// class BlockchainVerification {
//   constructor() {
//     this.blockchainRecord = {};
//   }

//   generateHash(delivery) {
//     const dataString = JSON.stringify({
//       orderNumber: delivery.orderNumber,
//       currentLocation: delivery.currentLocation,
//       status: delivery.status,
//       timestamp: delivery.timestamp
//     });
//     return crypto.createHash('sha256').update(dataString).digest('hex');
//   }

//   recordDelivery(delivery) {
//     const hash = this.generateHash(delivery);
//     this.blockchainRecord[delivery.orderNumber] = {
//       hash: hash,
//       verified: true
//     };
//     return hash;
//   }

//   verifyDelivery(delivery) {
//     const recordedEntry = this.blockchainRecord[delivery.orderNumber];
//     if (!recordedEntry) return false;

//     const currentHash = this.generateHash(delivery);
//     return currentHash === recordedEntry.hash;
//   }

//   simulateTampering(orderNumber) {
//     if (this.blockchainRecord[orderNumber]) {
//       this.blockchainRecord[orderNumber].verified = false;
//     }
//   }
// }

// export default new BlockchainVerification();
