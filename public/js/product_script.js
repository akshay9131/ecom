document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.atcbtn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function(event) {
            const button = event.target.closest('.atcbtn');
            const productId = button.getAttribute('data-id');
            await addToCart(productId);
            updateCartCount();
        });
    });
});

async function addToCart(productId) {
    try {
        const apiEndpoint = `http://localhost:3000/add-cart?id=${productId}`;
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Server issue');
        }

        const result = await response.json();
        alert('Product added to cart!');
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateCartCount() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/get-cart-count', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                document.getElementById('cartCount').textContent = xhr.responseText;
            } else {
                console.error('Error fetching cart count:', xhr.statusText);
            }
        }
    };

    xhr.send();
}
