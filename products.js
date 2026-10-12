export const products = [
    { name: "Шу Пуер", price: 600 },
    { name: "Да Хун Пао", price: 800 },
    { name: "Ті Гуань Інь", price: 500 }
];

export function getCheapProducts(products) {
    return products.filter(product => product.price < 700);
}