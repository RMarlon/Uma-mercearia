var _a;
// Elementos do DOM
var elements = {
    closedModalBtn: document.querySelector("#close-modal"),
    shoppingCart: document.getElementById("shopping-cart"),
    fade: document.querySelector("#fade"),
    modal: document.querySelector("#modal"),
    buttonPay: document.querySelector("#payment"),
    btnImgCart: document.querySelector(".btn-img-cart"),
    inputCopy: document.querySelector("#pixCode"),
    btnPixCopy: document.querySelector("#btn-pix-copy"),
    countCart: document.querySelector('#count-cart'),
    btnLess: document.querySelector('#btn-less'),
    btnMore: document.querySelector('#btn-more'),
    qtd: document.querySelector('#qtd'),
    priceItem: document.querySelector('.product-price')
};
// Estado da aplicação
var totalValue = 0;
var currentQuantity = 1;
var unitPriceText = ((_a = elements.priceItem) === null || _a === void 0 ? void 0 : _a.textContent) || 'R$ 0,00';
var unitPrice = parseFloat(unitPriceText.replace('R$', '').trim().replace(/\./g, '').replace(',', '.')) || 0;
// Inicialização
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
}
else {
    init();
}
function init() {
    updatePrice(currentQuantity);
    setupEventListeners();
    setupQuantityControls();
}
function setupEventListeners() {
    var _a, _b, _c;
    // Botões de remover produto
    document.querySelectorAll(".remove-product-cart")
        .forEach(function (btn) { return btn.addEventListener("click", removeItem); });
    // Inputs de quantidade
    document.querySelectorAll(".quantity-cart-product")
        .forEach(function (input) {
        input.addEventListener("change", function (e) {
            checkValueInput(e);
            updateProductPriceInCart(e);
        });
        input.min = "1";
    });
    // Botões de aumentar quantidade no carrinho
    document.querySelectorAll(".increase-quantity")
        .forEach(function (btn) { return btn.addEventListener("click", handleIncreaseQuantity); });
    // Botões de diminuir quantidade no carrinho
    document.querySelectorAll(".decrease-quantity")
        .forEach(function (btn) { return btn.addEventListener("click", handleDecreaseQuantity); });
    // Botões de adicionar ao carrinho
    document.querySelectorAll(".add-cart-button")
        .forEach(function (btn) { return btn.addEventListener("click", addProductCart); });
    // Botão de pagamento
    (_a = elements.buttonPay) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { return finalizePurchases(); });
    // Botão do carrinho
    (_b = elements.btnImgCart) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
        if (totalValue === 0) {
            finalizePurchases();
        }
    });
    // Fechar modal
    [elements.closedModalBtn, elements.fade].forEach(function (el) {
        el === null || el === void 0 ? void 0 : el.addEventListener("click", function () {
            clearCart();
            toggleModal();
        });
    });
    // Copiar código PIX
    (_c = elements.btnPixCopy) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
        if (elements.inputCopy) {
            elements.inputCopy.select();
            navigator.clipboard.writeText(elements.inputCopy.value);
        }
    });
}
// Funções para manipular quantidade no carrinho
function handleIncreaseQuantity(event) {
    var _a;
    var button = event.target;
    var input = (_a = button.closest('td')) === null || _a === void 0 ? void 0 : _a.querySelector('.quantity-cart-product');
    if (input) {
        input.value = (parseInt(input.value) + 1).toString();
        var changeEvent = new Event('change');
        input.dispatchEvent(changeEvent);
    }
}
function handleDecreaseQuantity(event) {
    var _a;
    var button = event.target;
    var input = (_a = button.closest('td')) === null || _a === void 0 ? void 0 : _a.querySelector('.quantity-cart-product');
    if (input && parseInt(input.value) > 1) {
        input.value = (parseInt(input.value) - 1).toString();
        var changeEvent = new Event('change');
        input.dispatchEvent(changeEvent);
    }
}
function clearCart() {
    var _a;
    var cartBody = document.querySelector(".table-cart tbody");
    if (cartBody) {
        cartBody.innerHTML = "";
    }
    totalValue = 0;
    updateTotal();
    updateCartCount();
    (_a = elements.shoppingCart) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
}
function updateProductPriceInCart(event) {
    var input = event.target;
    var productRow = input.closest(".product-in-cart");
    if (!productRow)
        return;
    var priceElement = productRow.querySelector(".price-product-cart");
    var quantity = parseInt(input.value) || 1;
    if (priceElement) {
        var newPrice = unitPrice * quantity;
        priceElement.textContent = "R$ ".concat(formatCurrency(newPrice));
        input.dataset.lastQuantity = quantity.toString();
    }
    updateTotal();
}
function setupQuantityControls() {
    var _a, _b;
    (_a = elements.btnMore) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        currentQuantity += 1;
        updateQuantityDisplay();
        updatePrice(currentQuantity);
    });
    (_b = elements.btnLess) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
        if (currentQuantity > 1) {
            currentQuantity -= 1;
            updateQuantityDisplay();
            updatePrice(currentQuantity);
        }
    });
}
function updateQuantityDisplay() {
    if (elements.qtd) {
        elements.qtd.textContent = currentQuantity.toString();
    }
}
function updatePrice(quantity) {
    if (elements.priceItem) {
        var totalPrice = unitPrice * quantity;
        elements.priceItem.textContent = "R$ ".concat(formatCurrency(totalPrice));
    }
}
function checkValueInput(event) {
    var target = event.target;
    var productElement = target.closest(".product-in-cart");
    if (target.value === "0" && productElement) {
        productElement.remove();
    }
    updateTotal();
    updateCartCount();
}
function updateCartCount() {
    var quantities = document.querySelectorAll('.quantity-cart-product');
    var totalItems = 0;
    quantities.forEach(function (input) {
        totalItems += parseInt(input.value) || 0;
    });
    if (elements.countCart) {
        elements.countCart.innerText = totalItems.toString();
    }
}
function addProductCart(event) {
    var _a, _b, _c, _d, _e, _f;
    var button = event.target;
    var productInfo = button.closest(".product") || ((_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement);
    if (!productInfo)
        return;
    var productImage = (_b = productInfo.querySelector(".image-product")) === null || _b === void 0 ? void 0 : _b.src;
    var productTitle = (_d = (_c = productInfo.querySelector(".title-product")) === null || _c === void 0 ? void 0 : _c.innerText) === null || _d === void 0 ? void 0 : _d.trim();
    var productPrice = "R$ ".concat(formatCurrency(unitPrice * currentQuantity));
    if (!productImage || !productTitle || !productPrice)
        return;
    var existingProduct = Array.from(document.querySelectorAll(".title-product-cart"))
        .find(function (el) { return el.innerText.trim() === productTitle; });
    if (existingProduct) {
        var productRow = existingProduct.closest("tr");
        var input = productRow === null || productRow === void 0 ? void 0 : productRow.querySelector(".quantity-cart-product");
        if (input && productRow) {
            var currentValue = parseInt(input.value) || 0;
            input.value = (currentValue + currentQuantity).toString();
            var priceElement = productRow.querySelector(".price-product-cart");
            if (priceElement) {
                var newPrice = unitPrice * parseInt(input.value);
                priceElement.textContent = "R$ ".concat(formatCurrency(newPrice));
            }
            updateTotal();
            return;
        }
    }
    var newRow = document.createElement("tr");
    newRow.classList.add("product-in-cart");
    newRow.innerHTML = "\n    <td class=\"pb-4\">\n      <div class=\"w-24 p-1 bg-orange-100 rounded-md mr-3\">\n        <p class=\"title-product-cart tracking-wider text-orange-800 text-center text-xs pb-2\">".concat(productTitle, "</p>\n        <img class=\"rounded-md\" src=\"").concat(productImage, "\" alt=\"").concat(productTitle, "\">\n      </div>\n    </td>\n    <td>\n      <span class=\"price-product-cart text-gray-500 text-xs font-semibold\">").concat(productPrice, "</span>\n    </td>\n    <td>\n      <div class=\"flex items-center justify-center\">\n        <button class=\"decrease-quantity w-6 h-6 flex items-center justify-center bg-orange-200 rounded-l-md hover:bg-orange-300 transition\">\n          -\n        </button>\n        <input class=\"quantity-cart-product w-10 outline-none border-y border-orange-200 text-center text-gray-700 font-bold\" \n               type=\"number\" \n               value=\"").concat(currentQuantity, "\" \n               min=\"1\"\n               data-last-quantity=\"").concat(currentQuantity, "\">\n        <button class=\"increase-quantity w-6 h-6 flex items-center justify-center bg-orange-200 rounded-r-md hover:bg-orange-300 transition\">\n          +\n        </button>\n      </div>\n    </td>\n    <td>\n      <button class=\"remove-product-cart w-5 h-5 flex justify-center items-center p-3 bg-orange-200 border border-orange-700 rounded-full text-white hover:bg-orange-300 transition\">X</button>\n    </td>\n  ");
    var cartBody = document.querySelector(".table-cart tbody");
    cartBody === null || cartBody === void 0 ? void 0 : cartBody.append(newRow);
    // Configura os event listeners para os novos elementos
    var quantityInput = newRow.querySelector(".quantity-cart-product");
    var increaseBtn = newRow.querySelector(".increase-quantity");
    var decreaseBtn = newRow.querySelector(".decrease-quantity");
    quantityInput === null || quantityInput === void 0 ? void 0 : quantityInput.addEventListener("change", function (e) {
        checkValueInput(e);
        updateProductPriceInCart(e);
    });
    increaseBtn === null || increaseBtn === void 0 ? void 0 : increaseBtn.addEventListener("click", handleIncreaseQuantity);
    decreaseBtn === null || decreaseBtn === void 0 ? void 0 : decreaseBtn.addEventListener("click", handleDecreaseQuantity);
    (_e = newRow.querySelector(".remove-product-cart")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", removeItem);
    (_f = elements.shoppingCart) === null || _f === void 0 ? void 0 : _f.classList.add("active");
    updateTotal();
    updateCartCount();
    currentQuantity = 1;
    updateQuantityDisplay();
    updatePrice(currentQuantity);
}
function removeItem(event) {
    var target = event.target;
    var productRow = target.closest("tr");
    if (productRow) {
        productRow.remove();
        updateTotal();
        updateCartCount();
    }
}
function updateTotal() {
    var _a;
    totalValue = 0;
    document.querySelectorAll(".product-in-cart").forEach(function (row) {
        var _a;
        var priceText = ((_a = row.querySelector(".price-product-cart")) === null || _a === void 0 ? void 0 : _a.innerText.replace("R$", "").replace(/\./g, "").replace(",", ".")) || "0";
        totalValue += parseFloat(priceText);
    });
    var totalElement = document.querySelector(".total-price span");
    if (totalElement) {
        totalElement.innerText = "R$ ".concat(formatCurrency(totalValue));
    }
    if (totalValue === 0) {
        (_a = elements.shoppingCart) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
    }
}
function finalizePurchases() {
    var notification = document.createElement("div");
    var btnAlert = document.createElement("button");
    if (totalValue <= 0) {
        showEmptyCartNotification(notification, btnAlert);
    }
    else {
        showCheckoutNotification(notification, btnAlert);
    }
}
function showEmptyCartNotification(notification, btnAlert) {
    notification.className = "alert";
    notification.style.cssText = "\n    position: fixed;\n    max-width: 340px;\n    padding: 2.7rem;\n    text-align: center;\n    margin: 0 -10rem;\n    border-radius: 10px;\n    letter-spacing: 3px;\n    transition: 0.3s;\n    top: 200px;\n    left: 50%;\n    color: #FFFFFF;\n    z-index: 999;\n    background-color: #9a3412;\n    box-shadow: 0 5px 3px 5px rgba(0, 0, 0, 0.5);\n  ";
    notification.innerText = "Seu carrinho está vazio! 😔";
    document.body.appendChild(notification);
    btnAlert.className = "btn-alert";
    btnAlert.style.cssText = "\n    position: fixed;\n    width: 25px;\n    height: 25px;\n    border-radius: 100%;\n    margin-left: 9rem;\n    border: solid white 1px;\n    font-weight: bold;\n    background-color: orange;\n    color: #ea580c;\n    box-shadow: 0 2px 1px 2px rgba(0, 0, 0, 0.1);\n    z-index: 1000;\n    top: 205px;\n    left: 50%;\n  ";
    btnAlert.innerText = "X";
    document.body.appendChild(btnAlert);
    btnAlert.addEventListener("click", function () {
        var _a;
        notification.remove();
        btnAlert.remove();
        (_a = elements.shoppingCart) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
        toggleModal();
    });
    toggleModal();
}
function showCheckoutNotification(notification, btnAlert) {
    notification.className = "alert";
    notification.style.cssText = "\n    position: fixed;\n    padding: 1rem;\n    margin: 0 -11rem;\n    text-align: center;\n    border-radius: 10px;\n    border: 1px solid orange;\n    letter-spacing: 2px;\n    font-size: 16px;\n    text-align: justify;\n    top: 180px;\n    left: 50%;\n    color: #FFFFFF;\n    z-index: 999;\n    background-color: #16a34a;\n    box-shadow: 0 5px 3px 5px rgba(0, 0, 0, 0.5);\n  ";
    notification.innerHTML = "\n    Agradecemos pela prefer\u00EAncia!<br><br>\n    O valor da sua compra \u00E9 de R$: ".concat(formatCurrency(totalValue), "<br>\n    Aperte em OK e fa\u00E7a seu pagamento via Pix no c\u00F3digo QR que ir\u00E1 aparecer!<br><br>\n    Volte sempre! \uD83D\uDE0A\n  ");
    document.body.appendChild(notification);
    btnAlert.className = "btn-alert";
    btnAlert.style.cssText = "\n    position: fixed;\n    width: 80px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    border-radius: 10px;\n    border: solid white 1px;\n    font-weight: bold;\n    margin: -1rem 5rem;\n    background-color: orange;\n    color: #ea580c;\n    box-shadow: 0 2px 1px 2px rgba(0, 0, 0, 0.1);\n    z-index: 1000;\n    left: 50%;\n    top: 385px;\n  ";
    btnAlert.innerText = "OK";
    document.body.appendChild(btnAlert);
    toggleModal();
    btnAlert.addEventListener("click", function () {
        clearCart();
        notification.remove();
        btnAlert.remove();
        toggleModal();
    });
}
function toggleModal() {
    if (elements.modal && elements.fade) {
        elements.modal.classList.toggle("hide");
        elements.fade.classList.toggle("hide");
    }
}
// Utilitários
function formatCurrency(value) {
    return value.toFixed(2)
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}
