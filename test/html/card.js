document.addEventListener('DOMContentLoaded', async () => {
	const form1 = document.getElementById('payment-form-1');
	const div1 = document.getElementById('payment-panel');
	const div2 = document.getElementById('card-panel');
	let submitted = false;
	form1.addEventListener('submit', async (e) => {
		if (submitted) {
			return;
		}
		submitted = true;
		form1.querySelector('button').disabled = true;
		form1.querySelector('button').value = 'Initializing payment ..';
		e.preventDefault();
		// Load the publishable key from the server. The publishable key
		// is set in your .env file.
		const {
			data: { publishableKey },
		} = await fetch('/api/payment/config').then((r) => r.json());

		if (!publishableKey) {
			addMessage('No publishable key returned from the server.  ');
			return;
		} else {
			// Make a call to the server to create a new
			// payment intent and store its client_secret.
			let backendError;
			const accessToken = document.querySelector('#accessToken').value;
			const paymentId = document.querySelector('#payment').value;
			const initPayment = await fetch('/api/payment/' + paymentId, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json', authorization: 'Bearer ' + accessToken },
			}).catch((err) => {
				backendError = err;
			});

			if (backendError) {
				addMessage(backendError.message);
				submitted = false;
				form1.querySelector('button').disabled = false;
				form1.querySelector('button').value = 'Next';
				return;
			}
			let clientSecret;
			let stripeAccount;
			const body = await initPayment.json();
			if (initPayment.status < 400) {
				clientSecret = body.data.stripe.clientSecret;
				stripeAccount = undefined;
				// body.data.stripe.destinationAccountId;
				addMessage(`Client secret returned: ${clientSecret}`);
				if (stripeAccount) addMessage(`Destination account returned: ${stripeAccount}`);
			} else {
				addMessage(`Error : ${JSON.stringify(body)}`);
				submitted = false;
				form1.querySelector('button').disabled = false;
				form1.querySelector('button').value = 'Next';
				return;
			}

			const stripe = Stripe(publishableKey, {
				apiVersion: '2020-08-27',
				stripeAccount: stripeAccount ?? undefined,
			});
			console.log({
				apiVersion: '2020-08-27',
				stripeAccount: stripeAccount ?? undefined,
			});
			await initPaymentForm(stripe, clientSecret);
		}

		div1.hidden = true;
		div2.hidden = false;
	});
});

async function initPaymentForm(stripe, clientSecret) {
	const form2 = document.getElementById('payment-form');

	const elements = stripe.elements();
	const card = elements.create('card');
	card.mount('#card-element');

	let submitted = false;
	form2.addEventListener('submit', async (e) => {
		e.preventDefault();

		// Disable double submission of the form
		if (submitted) {
			return;
		}
		submitted = true;
		form2.querySelector('button').disabled = true;

		const userNameInput = document.querySelector('#user-name');

		// Confirm the card payment given the clientSecret
		// from the payment intent that was just created on
		// the server.
		const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: card,
				billing_details: {
					name: userNameInput.value,
				},
			},
		});

		if (stripeError) {
			addMessage(stripeError.message);

			// reenable the form.
			submitted = false;
			form2.querySelector('button').disabled = false;
			return;
		}

		addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
	});
}
