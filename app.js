async function loadProducts() {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts"
        );

        const products = await response.json();

        console.log(products.slice(0, 5));
    } catch (error) {
        console.log("Помилка:", error.message);
    }
}

loadProducts();