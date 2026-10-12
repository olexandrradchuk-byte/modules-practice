
const products = [
    {
        id: 1,
        name: "Шу Пуер",
        price: 600,
        description: "Насичений китайський чай із м'яким деревним смаком.",
        image: "images/shu-puer.jpg"
    },
    {
        id: 2,
        name: "Да Хун Пао",
        price: 800,
        description: "Відомий улун із глибоким обсмаженим ароматом.",
        image: "images/da-hong-pao.jpg"
    },
    {
        id: 3,
        name: "Ті Гуань Інь",
        price: 500,
        description: "Ароматний улун із ніжними квітковими нотами.",
        image: "images/tie-guan-yin.jpg"
    }
];

const STORAGE_KEY = "tea-shop-cart";

const container = document.querySelector("#products");
const productsCount = document.querySelector("#products-count");
const searchInput = document.querySelector("#search");
const priceFilter = document.querySelector("#price-filter");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const cartItems = document.querySelector("#cart-items");
const checkoutButton = document.querySelector("#checkout-button");
const checkoutMessage = document.querySelector("#checkout-message");

function loadCart() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!Array.isArray(savedCart)) {
            return [];
        }

        return savedCart
            .filter(item =>
                item &&
                products.some(product => product.id === item.id) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0
            )
            .map(item => ({
                id: item.id,
                quantity: item.quantity
            }));
    } catch {
        return [];
    }
}

let cart = loadCart();

function saveCart() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error("Не вдалося зберегти кошик:", error);
    }
}

function renderProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const maxPrice = priceFilter.value;

    const filteredProducts = products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesPrice =
            maxPrice === "all" || product.price <= Number(maxPrice);

        return matchesName && matchesPrice;
    });

    productsCount.textContent = filteredProducts.length;

    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <p class="no-results">
                За вашим запитом нічого не знайдено.
            </p>
        `;
        return;
    }

    container.innerHTML = filteredProducts.map(product => `
        <article class="product">
            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="price">${product.price} грн</p>

            <button
                class="add-button"
                data-product-id="${product.id}"
            >
                Додати в кошик
            </button>
        </article>
    `).join("");
}

function renderCart() {
    const count = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    cartCount.textContent = count;
    cartTotal.textContent = `${total} грн`;
    checkoutButton.disabled = cart.length === 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">Кошик поки порожній.</p>
        `;
        saveCart();
        return;
    }

    cartItems.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) {
            return "";
        }

        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${product.name}</strong>
                    <p>${product.price} грн за одиницю</p>
                </div>

                <div class="quantity-controls">
                    <button
                        class="quantity-button"
                        data-action="decrease"
                        data-product-id="${product.id}"
                        aria-label="Зменшити кількість ${product.name}"
                    >−</button>

                    <span class="quantity-number">${item.quantity}</span>

                    <button
                        class="quantity-button"
                        data-action="increase"
                        data-product-id="${product.id}"
                        aria-label="Збільшити кількість ${product.name}"
                    >+</button>
                </div>

                <button
                    class="remove-button"
                    data-action="remove"
                    data-product-id="${product.id}"
                >
                    Видалити
                </button>
            </div>
        `;
    }).join("");

    saveCart();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    checkoutMessage.textContent = "";
    renderCart();
}

function changeQuantity(productId, amount) {
    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(cartItem => cartItem.id !== productId);
    }

    checkoutMessage.textContent = "";
    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    checkoutMessage.textContent = "";
    renderCart();
}

container.addEventListener("click", event => {
    const button = event.target.closest("[data-product-id]");

    if (button) {
        addToCart(Number(button.dataset.productId));
    }
});

cartItems.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");

    if (!button) return;

    const productId = Number(button.dataset.productId);
    const action = button.dataset.action;

    if (action === "increase") {
        changeQuantity(productId, 1);
    } else if (action === "decrease") {
        changeQuantity(productId, -1);
    } else if (action === "remove") {
        removeFromCart(productId);
    }
});

searchInput.addEventListener("input", renderProducts);
priceFilter.addEventListener("change", renderProducts);

checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) return;

    checkoutMessage.textContent =
        "Кошик готовий! Наступний крок — підключити форму замовлення.";
});

renderProducts();
renderCart();
const testButton = document.querySelector("#test-button");

testButton.addEventListener("click", function () {
    console.log("JavaScript працює!");
});
const message = document.querySelector("#message");
const changeButton = document.querySelector("#change-button");

changeButton.addEventListener("click", function () {
    if (message.textContent === "Привіт! Натисни кнопку.") {
        message.textContent = "Ти щойно змінив текст через JavaScript!";
    } else {
        message.textContent = "Привіт! Натисни кнопку.";
    }
});