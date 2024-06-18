
document.getElementById('logForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/sign-up', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            const responseMessage = document.getElementById('responseMessage');
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        responseMessage.style.color = 'green';
                        responseMessage.textContent = 'sign-up successful!';
                        
                        window.location.href = '/';
                    } else {
                        responseMessage.style.color = 'red';
                        responseMessage.textContent = response.error;
                    }
                } catch (e) {
                    responseMessage.style.color = 'red';
                    responseMessage.textContent = 'Error parsing response: ' + e.message;
                }
            } else {
                responseMessage.style.color = 'red';
                responseMessage.textContent = "incorrect input fields";
            }
        }
    };
    
    const params = JSON.stringify({ email: email, password: password, gender: gender, name: name, mobile: mobile });
    xhr.send(params);
});