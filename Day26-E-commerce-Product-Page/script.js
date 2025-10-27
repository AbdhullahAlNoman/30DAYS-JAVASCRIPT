// ---------------------------
// CART FUNCTIONS
// ---------------------------
function readCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function writeCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ---------------------------
// UPDATE CART DISPLAY (for testing)
// ---------------------------
function updateCartUI() {
  const cart = readCart();
  console.log("Cart Updated:", cart);
}

// ---------------------------
// QUANTITY CONTROL
// ---------------------------
const qtyInput = document.getElementById("quantity");
document.getElementById("plus").addEventListener("click", () => {
  qtyInput.value = parseInt(qtyInput.value) + 1;
});
document.getElementById("minus").addEventListener("click", () => {
  if (qtyInput.value > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
});

// ---------------------------
// ADD TO CART
// ---------------------------
document.getElementById("addToCart").addEventListener("click", () => {
  const qty = parseInt(qtyInput.value);
  const product = {
    id: 1,
    name: "Smart Watch Pro",
    price: 99,
    qty,
  };

  const cart = readCart();
  const existing = cart.find(p => p.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push(product);
  }
  writeCart(cart);
  updateCartUI();
  alert("✅ Added to cart successfully!");
});

// ---------------------------
// BUY NOW
// ---------------------------
document.getElementById("buyNow").addEventListener("click", () => {
  alert("🛒 Redirecting to checkout...");
  // এখানে real checkout পেজে redirect করতে পারো:
  // window.location.href = "checkout.html";
});

// ---------------------------
// INIT
// ---------------------------
updateCartUI();
