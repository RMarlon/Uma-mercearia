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
    pixModal: document.querySelector("#pix-modal"),
};
// Estado da aplicação
var totalValue = 0;
// Inicialização
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
}
else {
    init();
}
function init() {
    setupQuantityControls();
    setupEventListeners();
}
function setupQuantityControls() {
    document.querySelectorAll('.items').forEach(function (item) {
        var btnLess = item.querySelector('.btn-less');
        var btnMore = item.querySelector('.btn-more');
        var qtdElement = item.querySelector('.qtd');
        var priceElement = item.querySelector('.product-price');
        if (!btnLess || !btnMore || !qtdElement || !priceElement)
            return;
        // Obter preço unitário do data-attribute
        var unitPriceText = priceElement.getAttribute('data-unit-price') || '0';
        var unitPrice = parseFloat(unitPriceText);
        var currentQuantity = parseInt(qtdElement.textContent || '1');
        // Função para atualizar a exibição
        var updateDisplay = function () {
            qtdElement.textContent = currentQuantity.toString();
            var totalPrice = unitPrice * currentQuantity;
            priceElement.textContent = "R$ ".concat(formatCurrency(totalPrice));
        };
        // Evento para diminuir quantidade
        btnLess.addEventListener('click', function () {
            if (currentQuantity > 1) {
                currentQuantity--;
                updateDisplay();
            }
        });
        // Evento para aumentar quantidade
        btnMore.addEventListener('click', function () {
            currentQuantity++;
            updateDisplay();
        });
    });
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
            var notification = document.createElement("div");
            var btnAlert = document.createElement("button");
            showEmptyCartNotification(notification, btnAlert);
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
    var _a;
    var input = event.target;
    var productRow = input.closest(".product-in-cart");
    if (!productRow)
        return;
    var priceElement = productRow.querySelector(".price-product-cart");
    var quantity = parseInt(input.value) || 1;
    var unitPriceText = ((_a = priceElement === null || priceElement === void 0 ? void 0 : priceElement.textContent) === null || _a === void 0 ? void 0 : _a.replace('R$', '').trim().replace(/\./g, '').replace(',', '.')) || '0';
    var unitPrice = parseFloat(unitPriceText) / (parseInt(input.dataset.lastQuantity || '1') || 1);
    if (priceElement) {
        var newPrice = unitPrice * quantity;
        priceElement.textContent = "R$ ".concat(formatCurrency(newPrice));
        input.dataset.lastQuantity = quantity.toString();
    }
    updateTotal();
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
    var _a, _b, _c, _d, _e;
    var button = event.target;
    var productItem = button.closest(".items");
    var productInfo = productItem === null || productItem === void 0 ? void 0 : productItem.querySelector(".all-products-move");
    if (!productInfo)
        return;
    // Obter a quantidade atual
    var qtdElement = productInfo.querySelector('.qtd');
    var currentQuantity = qtdElement ? parseInt(qtdElement.textContent || '1') : 1;
    var productImage = (_a = productInfo.querySelector(".image-product")) === null || _a === void 0 ? void 0 : _a.src;
    var productTitle = (_c = (_b = productInfo.querySelector(".title-product")) === null || _b === void 0 ? void 0 : _b.innerText) === null || _c === void 0 ? void 0 : _c.trim();
    var priceElement = productInfo.querySelector(".product-price");
    var unitPriceText = (priceElement === null || priceElement === void 0 ? void 0 : priceElement.getAttribute('data-unit-price')) || '0';
    var unitPrice = parseFloat(unitPriceText);
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
            var priceElement_1 = productRow.querySelector(".price-product-cart");
            if (priceElement_1) {
                var newPrice = unitPrice * parseInt(input.value);
                priceElement_1.textContent = "R$ ".concat(formatCurrency(newPrice));
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
    (_d = newRow.querySelector(".remove-product-cart")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", removeItem);
    (_e = elements.shoppingCart) === null || _e === void 0 ? void 0 : _e.classList.add("active");
    updateTotal();
    updateCartCount();
    // Resetar quantidade para 1 após adicionar ao carrinho
    if (qtdElement) {
        qtdElement.textContent = '1';
        if (priceElement) {
            priceElement.textContent = "R$ ".concat(formatCurrency(unitPrice * 1));
        }
    }
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
    if (totalValue <= 0) {
        var notification_1 = document.createElement("div");
        var btnAlert_1 = document.createElement("button");
        showEmptyCartNotification(notification_1, btnAlert_1);
        return; // Adiciona este return para evitar que o modal do PIX apareça
    }
    // Mostra primeiro o modal de confirmação
    var notification = document.createElement("div");
    var btnAlert = document.createElement("button");
    showCheckoutNotification(notification, btnAlert, totalValue);
}
function showEmptyCartNotification(notification, btnAlert) {
    notification.className = "empty-cart-modal";
    notification.style.cssText = "\n    position: fixed;\n    max-width: 90%;\n    width: 340px;\n    padding: 2rem;\n    text-align: center;\n    border-radius: 10px;\n    letter-spacing: 1px;\n    transition: 0.3s;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    z-index: 1000;\n    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);\n    background-color: white;\n    font-family: Arial, sans-serif;\n    color: #5c2c0e;\n  ";
    notification.innerHTML = "<p style=\"margin: 0; font-size: 1.1rem;\">Seu carrinho est\u00E1 vazio! \uD83D\uDE14</p>";
    document.body.appendChild(notification);
    btnAlert.className = "close-empty-cart-btn";
    btnAlert.style.cssText = "\n    position: absolute;\n    width: 30px;\n    height: 30px;\n    border-radius: 50%;\n    background-color: #5c2c0e;\n    color: white;\n    border: none;\n    font-weight: bold;\n    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n    z-index: 1001;\n    cursor: pointer;\n    transition: all 0.2s;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    font-size: 1rem;\n    top: -15px;\n    right: -15px;\n  ";
    btnAlert.innerText = "X";
    notification.appendChild(btnAlert);
    btnAlert.addEventListener("click", function () {
        var _a;
        notification.remove();
        (_a = elements.shoppingCart) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
        toggleModal();
    });
    toggleModal();
}
function showCheckoutNotification(notification, btnAlert, totalValue) {
    notification.className = "checkout-modal";
    notification.style.cssText = "\n    position: fixed;\n    max-width: 90%;\n    width: 340px;\n    padding: 2rem 2rem 3.5rem 2rem;\n    text-align: left;\n    border-radius: 10px;\n    letter-spacing: 1px;\n    transition: 0.3s;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    z-index: 1001; // Aumentado para 1001\n    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);\n    background-color: white;\n    font-family: Arial, sans-serif;\n    color: #333;\n    font-size: 16px;\n    border: 1px solid #e0e0e0;\n  ";
    notification.innerHTML = "\n    <div style=\"color: #16a34a; font-weight: bold; text-align: center; margin-bottom: 1rem; font-size: 1.2rem;\">\n      Agradecemos pela prefer\u00EAncia!\n    </div>\n    O valor da sua compra \u00E9 de R$: ".concat(formatCurrency(totalValue), "<br><br>\n    Aperte em OK para visualizar o c\u00F3digo PIX<br><br>\n    Volte sempre! \uD83D\uDE0A\n  ");
    document.body.appendChild(notification);
    btnAlert.className = "confirm-checkout-btn";
    btnAlert.style.cssText = "\n    position: absolute;\n    width: 100px;\n    height: 40px;\n    border-radius: 20px;\n    background-color: #16a34a;\n    color: white;\n    border: none;\n    font-weight: bold;\n    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n    z-index: 1002;\n    cursor: pointer;\n    transition: all 0.2s;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    font-size: 1rem;\n    bottom: 20px;\n    left: 50%;\n    transform: translateX(-50%);\n  ";
    btnAlert.innerText = "OK";
    notification.appendChild(btnAlert);
    toggleModal();
    btnAlert.addEventListener("click", function () {
        // Remove o modal de confirmação
        notification.remove();
        // Mostra o modal do PIX com z-index maior
        if (elements.pixModal) {
            elements.pixModal.style.zIndex = "1002"; // Garante que fique na frente
            elements.pixModal.classList.remove("hide");
        }
        // Opcional: Adicione um botão para fechar o modal do PIX
        var closePixBtn = document.createElement("button");
        closePixBtn.textContent = "Fechar";
        closePixBtn.style.cssText = "\n      position: absolute;\n      bottom: 20px;\n      left: 50%;\n      transform: translateX(-50%);\n      padding: 10px 20px;\n      background-color: #9a3412;\n      color: white;\n      border: none;\n      border-radius: 5px;\n      cursor: pointer;\n    ";
        closePixBtn.addEventListener("click", function () {
            if (elements.pixModal) {
                elements.pixModal.classList.add("hide");
            }
            clearCart();
        });
        if (elements.pixModal) {
            elements.pixModal.appendChild(closePixBtn);
        }
    });
}
function toggleModal() {
    if (elements.modal && elements.fade) {
        elements.modal.classList.toggle("hide");
        elements.fade.classList.toggle("hide");
        // Esconde o modal do PIX quando outros modais são mostrados
        if (elements.pixModal && !elements.modal.classList.contains("hide")) {
            elements.pixModal.classList.add("hide");
        }
    }
}
// Utilitários
function formatCurrency(value) {
    return value.toFixed(2)
        .replace(".", ",")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}
