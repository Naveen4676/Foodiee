document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("total-price");
    const cartCountEl = document.getElementById("cart-count");
    const clearCartBtn = document.getElementById("clear-cart");
    const orderNowBtn = document.getElementById("order-now"); // Ensure it's only selected, not created

    function updateCart() {
        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const itemEl = document.createElement("div");
            itemEl.classList.add("cart-item");
            itemEl.innerHTML = `
                <span>${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}</span>
                <span class="remove-item" data-index="${index}" style="cursor:pointer; color:#FFD700;">❌</span>
            `;
            cartItems.appendChild(itemEl);
        });

        totalPriceEl.textContent = `Total: ₹${total}`;
        cartCountEl.textContent = cart.length;
        localStorage.setItem("cart", JSON.stringify(cart));

        // Show "Order Now" button only if cart has items
        orderNowBtn.style.display = cart.length > 0 ? "block" : "none";

        // Remove items from cart
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                const index = parseInt(this.getAttribute("data-index"));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const name = this.getAttribute("data-name");
            const price = parseInt(this.getAttribute("data-price"));

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            updateCart();
        });
    });

    clearCartBtn.addEventListener("click", function () {
        cart.length = 0;
        updateCart();
    });

    // Order Now button logic
    orderNowBtn.addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        let orderDetails = "🛒 Order Summary:\n";
        cart.forEach(item => {
            orderDetails += `🔹 ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}\n`;
        });

        const totalAmount = totalPriceEl.textContent;
        orderDetails += `\n💰 ${totalAmount}`;

        // Redirect to WhatsApp Order (Replace with your number)
        const phoneNumber = "918977348638"; // Add your WhatsApp number here
        const encodedMessage = encodeURIComponent(orderDetails);
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.location.href = whatsappLink;
    });

    updateCart();
});


document.addEventListener("DOMContentLoaded", function () {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    function updateFavorites() {
        const favoritesContainer = document.getElementById("favorites-list");
        favoritesContainer.innerHTML = "";

        if (favorites.length === 0) {
            favoritesContainer.innerHTML = "<p>No favorite items yet! ❤️</p>";
        }

        favorites.forEach((item, index) => {
            const favItem = document.createElement("div");
            favItem.classList.add("favorite-item");
            favItem.innerHTML = `
                ❤️ ${item}
                <button class="remove-favorite" data-index="${index}">❌</button>
            `;
            favoritesContainer.appendChild(favItem);
        });

        // Remove item with slide-out effect
        document.querySelectorAll(".remove-favorite").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                const itemToRemove = e.target.parentElement;
                
                itemToRemove.classList.add("removing"); // Apply slide-out effect
                
                setTimeout(() => {
                    favorites.splice(index, 1);
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                    updateFavorites();
                }, 300); // Wait for animation to finish
            });
        });
    }

    // Add to Favorites with Pop Effect
    document.querySelectorAll(".add-to-favorites").forEach(button => {
        button.addEventListener("click", function () {
            const name = this.getAttribute("data-name");

            if (!favorites.includes(name)) {
                favorites.push(name);
                localStorage.setItem("favorites", JSON.stringify(favorites));
                updateFavorites();
                
                // Add a temporary pop effect to the button
                this.classList.add("clicked");
                setTimeout(() => this.classList.remove("clicked"), 200);

                alert(`${name} added to favorites! ❤️`);
            } else {
                alert(`${name} is already in favorites!`);
            }
        });
    });

    // Clear All Favorites with Animation
    document.getElementById("clear-favorites").addEventListener("click", function () {
        document.querySelectorAll(".favorite-item").forEach(item => {
            item.classList.add("removing"); // Apply slide-out effect
        });

        setTimeout(() => {
            favorites = [];
            localStorage.removeItem("favorites");
            updateFavorites();
            alert("All favorites have been cleared! ❌");
        }, 300);
    });

    updateFavorites();
});

document.getElementById("toggle-theme").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// Keep Dark Mode active on refresh
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
}
document.getElementById("apply-coupon").addEventListener("click", function () {
    const couponInput = document.getElementById("coupon-input").value.trim();
    const totalPriceEl = document.getElementById("total-price");
    let totalPrice = parseInt(totalPriceEl.textContent.replace("Total: ₹", ""));

    const validCoupons = {
        "FOODIEE20": 10,  // 10% Discount
        "FOODIEE50": 15   // 15% Discount
    };

    if (validCoupons[couponInput]) {
        let discount = (totalPrice * validCoupons[couponInput]) / 100;
        let newTotal = totalPrice - discount;
        totalPriceEl.textContent = `Total: ₹${newTotal}`;
        document.getElementById("discount-message").textContent = `✅ ${validCoupons[couponInput]}% Discount Applied!`;
    } else {
        document.getElementById("discount-message").textContent = "❌ Invalid Coupon Code.";
    }
});

