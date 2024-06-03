const addToCartButtons = document.querySelectorAll('.atcbtn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const productId = event.target.getAttribute('data-id');
            addToCart(productId);
        });
    });

    
    function addToCart(productId) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/add-cart?product_id=${productId}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    alert('Product added to cart successfully!');

                    updateCartCount();
                } else {
                    alert('Error adding product to cart: ' + xhr.statusText);
                }
            }
        };

        xhr.send();
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
                    
                    console.error('Error fetching cart count: ' + xhr.statusText);
                }
            }
        };

        xhr.send();
    }