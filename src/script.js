var items = document.querySelectorAll(".items");
var closedModalBtn = document.querySelector("#close-modal");
var shoppingCart = document.getElementById("shopping-cart");
var buttonPay = document.querySelector("#payment");
var fade = document.querySelector("#fade");
var modal = document.querySelector("#modal");
var car = document.querySelector(".car");
var quntityCart = document.querySelectorAll(".quantity-cart-product");
for (var i = 0; i < (quntityCart === null || quntityCart === void 0 ? void 0 : quntityCart.length); i++) {
    quntityCart[i].addEventListener("change", updateInfoCart);
}
//--------------
function updateInfoCart() {
    //Atualiza o valor no carrinho de comprar ao remover o produto
    var productInCart = document.querySelectorAll(".product-in-cart");
    var totalProduct = 0;
    for (var i = 0; i < productInCart.length; i++) {
        var priceProductCart = productInCart[i].querySelectorAll(".price-product-cart")[0].innerText.replace("R$", "").replace(",", ".");
        var quantityProductCart = productInCart[i].querySelectorAll(".quantity-cart-product")[0].value;
        totalProduct += (+priceProductCart * +quantityProductCart);
    }
    totalProduct = totalProduct.toFixed(2);
    totalProduct = totalProduct.replace(".", ",");
    var totalPrice = document.querySelector(".total-price span");
    totalPrice.innerText = "R$ ".concat(totalProduct.toString());
}
//--------------
var removeProductBtn = document.querySelectorAll(".remove-product");
for (var i = 0; i < removeProductBtn.length; i++) {
    // Evento para remover os produtos do carrinho de compras
    removeProductBtn[i].addEventListener("click", function (event) {
        var targetElement = event.target;
        var targetProduct = targetElement.closest("tr");
        if (targetProduct) {
            targetProduct.remove();
        }
        updateInfoCart();
    });
}
//--------------
var addCart = document.querySelectorAll(".add-cart");
addCart.forEach(function (event) {
    //Essa função adiciona os itens no carrinho
    event.addEventListener("click", function addItemCart(element) {
        var _a, _b, _c;
        var elementTarget = element.target;
        var products = elementTarget.closest(".all-products-move");
        if (!products)
            return;
        var imageProduct = ((_a = products.querySelector(".image-product")) === null || _a === void 0 ? void 0 : _a.src) || "";
        var titleProduct = ((_b = products.querySelector(".title-product")) === null || _b === void 0 ? void 0 : _b.innerText) || "Produto sem título";
        var price = ((_c = products.querySelector(".price")) === null || _c === void 0 ? void 0 : _c.innerText) || "0,00";
        var createNewProduct = document.createElement("tr");
        createNewProduct.classList.add("product-in-cart");
        createNewProduct.innerHTML =
            "\n         <td class=\"pt-4 border-b-orange-800\">\n         <div class=\"w-24 max-w-full max-h-full p-1 bg-orange-100 rounded-md\">\n              <h2 class=\"uppercase tracking-wider text-orange-800 text-center\">".concat(titleProduct, "</h2>\n              <img class=\"rounded-md\" src=\"").concat(imageProduct, "\" alt=\"").concat(titleProduct, "\">\n         </div>\n      </td>\n\n      <td>\n        <span class=\"price-product-cart text-gray-700 font-bold\">R$ ").concat(price, "</span>\n      </td>\n\n      <td>\n        <input class=\"quantity-cart-product w-16 outline-none border-none rounded-md text-center text-gray-700 font-bold p-1\" type=\"number\" value=\"1\">\n      </td>\n\n      <td>\n        <button class=\"remove-product w-5 h-5 flex justify-center items-center p-3 bg-orange-200 border border-orange-700 rounded-full text-white\">X</button>\n      </td>\n        ");
        var bodyTable = document.querySelector(".add-tbody");
        if (bodyTable) {
            bodyTable === null || bodyTable === void 0 ? void 0 : bodyTable.appendChild(createNewProduct);
        }
        updateInfoCart();
    });
});
items.forEach(function (product) {
    var _a;
    var btnLess = product.querySelector(".btn-less");
    var btnMore = product.querySelector(".btn-more");
    var quatity = product.querySelector(".quantity");
    var price = product.querySelector(".price");
    if (!btnLess || !btnMore || !quatity || !price)
        return;
    var count = parseInt(quatity.textContent || "1", 10);
    var convertPrice = parseFloat(((_a = price.textContent) === null || _a === void 0 ? void 0 : _a.replace("R$", "").trim()) || "0");
    var updatePrice = function () {
        var priceNew = (convertPrice * count).toFixed(2);
        price.textContent = "R$ ".concat(priceNew);
    };
    btnLess.addEventListener("click", function () {
        if (count > 1) {
            count--;
            quatity.textContent = count.toString();
            updatePrice();
        }
    });
    btnMore.addEventListener("click", function () {
        count++;
        quatity.textContent = count.toString();
        updatePrice();
    });
    buttonPay === null || buttonPay === void 0 ? void 0 : buttonPay.addEventListener("click", function () {
        toggleModal();
    });
});
car === null || car === void 0 ? void 0 : car.addEventListener("click", function () {
    if (shoppingCart) {
        shoppingCart.style.display =
            shoppingCart.style.display === "none" ? "block" : "none";
    }
});
[closedModalBtn, fade].forEach(function (element) {
    element === null || element === void 0 ? void 0 : element.addEventListener("click", function () {
        toggleModal();
    });
});
function toggleModal() {
    modal === null || modal === void 0 ? void 0 : modal.classList.toggle("hide");
    fade === null || fade === void 0 ? void 0 : fade.classList.toggle("hide");
}
