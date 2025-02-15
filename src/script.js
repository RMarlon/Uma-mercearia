var closedModalBtn = document.querySelector("#close-modal");
var shoppingCart = document.getElementById("shopping-cart");
var buttonPay = document.querySelector("#payment");
var fade = document.querySelector("#fade");
var modal = document.querySelector("#modal");
var car = document.querySelector(".car");
//--------------
//remover o produto do carrinho
var removeProductCartBtn = document.querySelectorAll(".remove-product-cart");
for (var i = 0; i < removeProductCartBtn.length; i++) {
    removeProductCartBtn[i].addEventListener("click", function (element) {
        var target = element.target;
        var elementProduct = target.closest(".product-in-cart");
        if (elementProduct) {
            elementProduct.remove();
        }
        updateTotal();
    });
}
//--------------
//Atualizando o valor dos produtos dentro do carrinho
function updateTotal() {
    var totalValue = 0;
    var updateValueCart = document.querySelectorAll(".product-in-cart");
    for (var i = 0; i < updateValueCart.length; i++) {
        var priceProductCart = updateValueCart[i].querySelectorAll(".price-product-cart")[0].innerText.replace("R$", "").replace(",", ".");
        var inputQuantityCart = updateValueCart[i].querySelectorAll(".quantity-cart-product")[0].value;
        totalValue += (+priceProductCart * +inputQuantityCart);
    }
    totalValue = totalValue.toFixed(2).replace(".", ",");
    var updateSpanValue = document.querySelector(".total-price span");
    if (updateSpanValue) {
        updateSpanValue.innerText = "R$ ".concat(totalValue.toString());
    }
}
//--------------
//--------------
//--------------    
buttonPay === null || buttonPay === void 0 ? void 0 : buttonPay.addEventListener("click", function () {
    toggleModal();
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
