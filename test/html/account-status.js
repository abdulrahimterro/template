document.addEventListener('DOMContentLoaded', async () => {
	const statusEl = document.getElementById('account-status');
	const response = await fetch('/api/payment/account-status?' + new URL(location).searchParams.toString());
	const body = await response.json();
	if (response.status >= 400) {
		addMessage(`Error : ${JSON.stringify(body)}`);
		return;
	}
	const {
		data: { account, connected, requirements },
	} = body;
	let status = [];
	if (account) {
		status.push('<p style="color:green"> You have an account with id : <b>');
		status.push(account);
		status.push('</b></p> ');

		if (connected) status.push('<p style="color:green"> <em>your account is fully connected to our platform.</em></p> ');
		else {
			status.push('<p style="color:red"> <em> but it is not perfectly connected to our platform</em></p> ');
			status.push('<p style="color:blue"> <i>you must provide the following data to connect correctly: <br/>');
			status.push('<ul>');
			status.push(...requirements.map((r) => `<li>${r}</li>`));
			status.push('</ul></i> </p><br/>');
		}
	} else {
		status.push('<p style="color:red"><em>You do not have any account for the provided service.</em></p><br/>');
	}
	statusEl.innerHTML = status.join('');
});
