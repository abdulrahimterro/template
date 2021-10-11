const form = document.getElementById('onboard-form');
let submitted = false;
form.addEventListener('submit', async (e) => {
	e.preventDefault();

	if (submitted) {
		return;
	}
	submitted = true;
	let elmButton = form.querySelector('#submit');
	elmButton.disabled = true;
	elmButton.textContent = 'Opening...';
	const serviceId = document.querySelector('#serviceId').value;
	const serviceType = document.querySelector('#serviceType').value;
	fetch(`/api/payment/initiate-onboarding?serviceId=${serviceId}&serviceType=${serviceType}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => response.json())
		.then((response) => {
			if (response.data) {
				const url = response.data.url;
				if (url) {
					console.log(`forwarding to ${url}`);
					window.location.replace(url);
				} else {
					elmButton.removeAttribute('disabled');
					elmButton.textContent = '<Something went wrong>';
				}
			} else {
				addMessage(JSON.stringify(response));
				submitted = false;
				elmButton.disabled = false;
				elmButton.textContent = 'onboard user';
			}
		})
		.catch((err) => {
			addMessage(err.message);
			submitted = false;
			elmButton.disabled = false;
			elmButton.textContent = 'onboard user';
		});
});
