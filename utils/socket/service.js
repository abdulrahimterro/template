const { Order: OrderEnums, Payment } = require('../constants/enums');
class SocketService {
	constructor(data) {}

	connection(client) {
		const { Canceled, Rejected, Delivered, Picked_Up } = OrderEnums.Status;
		const { Order } = require('database').mongodb.Models;
		Order.find(
			{ paymentStatus: { $ne: Payment.Status.Pending }, status: { $nin: [Canceled, Rejected, Delivered, Picked_Up] } },
			'status branch type totalPrice supTotal address createdAt acceptedTime readyTime payment paymentStatus',
			{ populate: { path: 'user', select: 'firstName lastName' } }
		)
			.then((docs) => {
				io.to(client.id).emit('init', { data: docs });
			})
			.catch((err) => console.log(err));
	}
}

module.exports = new SocketService();
