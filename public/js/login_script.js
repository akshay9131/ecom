
document.getElementById('logForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value; 
    const password = document.getElementById('password').value;
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            const responseMessage = document.getElementById('responseMessage');
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        responseMessage.style.color = 'green';
                        responseMessage.textContent = 'Login successful!';


                        window.location.href = '/product'; 
                    } else {
                        responseMessage.style.color = 'red';
                        responseMessage.textContent = "Wrong Credentials";
                    }
                } catch (e) {
                    responseMessage.style.color = 'red';
                    responseMessage.textContent = 'Error parsing response: ' + e.message;
                }
            } else {
                responseMessage.style.color = 'red';
                responseMessage.textContent = "Wrong Credentials";
            }
        }
    };
    
    const params = JSON.stringify({ email: email, password: password });
    xhr.send(params);
});