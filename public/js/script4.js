document.querySelectorAll('.pm').forEach(button => {
    button.addEventListener('click', function (event) {
        const productId = event.target.dataset.productId;
        const action = event.target.classList.contains('add') ? 'add' : 'subtract';
        updateCartItem(productId, action);
    });
});



function updateCartItem(productId, action) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/update-cart?product_id=${productId}&action=${action}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const updatedCartData = JSON.parse(xhr.responseText);
                updateUI(updatedCartData, productId);
            } else {
                console.error('Error updating cart item:', xhr.statusText);
            }
        }
    };

    xhr.send();
}

function updateUI(responseData, productId) {
    const updatedQuantity = responseData.quantity;
    console.log('Product ID:', productId);

    const quantityElement = document.querySelector(`.card[data-product-id="${productId}"] .atc h5`);
    if (quantityElement) {
        console.log('Quantity Element:', quantityElement);
        quantityElement.textContent = updatedQuantity;
    } else {
        console.error(`Quantity element not found for product ID ${productId}`);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const stripe = Stripe('pk_test_51PKJKxSG9CGXHbqunYdJv2qSG9Jp5rF6Os6EoNJObRPm8UXqRTiyhrfji5qSuGvs5ryi1DyPRZ29VmFsq0INTStx00QYhSkZJL'); // Replace with your Stripe publishable key
    console.log("dom loaded")

    document.getElementById('checkout-button').addEventListener('click', async () => {
        console.log("clickkkkk");
        const response = await fetch('/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const session = await response.json();

        const result = await stripe.redirectToCheckout({
            sessionId: session.id
        });

        if (result.error) {
            alert(result.error.message);
        }
    });
});