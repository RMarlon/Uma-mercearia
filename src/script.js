var closedModalBtn = document.querySelector("#close-modal");
var shoppingCart = document.getElementById("shopping-cart");
var fade = document.querySelector("#fade");
var modal = document.querySelector("#modal");
var car = document.querySelector(".car");
//--------------
var totalValue = "0,00";
//--------------
//Verificando se o HTML do DOM já foi carregado
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loading);
}
else {
    loading();
}
//--------------
//--------------
// Eventos que vão rodar apenas quando o DOM estiver carregado
function loading() {
    //--------------
    //Pegando o botão de remover o produto
    var removeProductCartBtn = document.querySelectorAll(".remove-product-cart");
    for (var i = 0; i < removeProductCartBtn.length; i++) {
        removeProductCartBtn[i].addEventListener("click", removeItem);
    }
    //--------------
    //--------------
    //Peganquando os inputs de quantidade
    var quantityInputCart = document.querySelectorAll(".quantity-cart-product");
    for (var i = 0; i < quantityInputCart.length; i++) {
        quantityInputCart[i].addEventListener("change", checkValueInput);
    }
    //--------------
    //--------------
    //Pegando o botão de adicionar o produto ao carrinho
    var buttonAddCart = document.querySelectorAll(".add-cart-button");
    for (var i = 0; i < buttonAddCart.length; i++) {
        buttonAddCart[i].addEventListener("click", addProductCart);
    }
    //--------------
    //--------------
    //Evento click para abrir o modal de pagamento por pix
    var buttonPay = document.querySelector("#payment");
    buttonPay === null || buttonPay === void 0 ? void 0 : buttonPay.addEventListener("click", function () {
        finalizePurchases();
    });
    //--------------
    //--------------
    //Evento de click para abrir o modal do carrinho
    car === null || car === void 0 ? void 0 : car.addEventListener("click", function () {
        if (shoppingCart) {
            shoppingCart.classList.toggle("active");
        }
    });
    //--------------
    //--------------
    //Evendo de click para fechar o modal de pagamento por pix
    [closedModalBtn, fade].forEach(function (element) {
        element === null || element === void 0 ? void 0 : element.addEventListener("click", function () {
            var concluedPay = document.querySelector(".table-cart tbody");
            if (concluedPay && shoppingCart) {
                concluedPay.innerHTML = "";
                shoppingCart.classList.remove("active");
            }
            toggleModal();
            updateTotal();
        });
    });
}
//--------------
//--------------
//Remove o produto do carrinho quando input for zero
function checkValueInput(event) {
    var targetValue = event.target;
    var elementTarget = targetValue.closest(".product-in-cart");
    if (targetValue.value <= "0" && elementTarget && shoppingCart) {
        shoppingCart.classList.remove("active");
        elementTarget.remove();
    }
    updateTotal();
}
//--------------
//--------------
//Adicionando o produto no carrinho
function addProductCart(element) {
    var buttonOfAddCart = element.target;
    var infoProducts = buttonOfAddCart.parentElement.parentElement;
    var imagesOfProducts = infoProducts.querySelectorAll(".image-product")[0].src;
    var titleProduct = infoProducts.querySelectorAll(".title-product")[0].innerText;
    var priceProduct = infoProducts.querySelectorAll(".product-price")[0].innerText;
    var nameOfProducts = document.querySelectorAll(".title-product-cart");
    for (var i = 0; i < nameOfProducts.length; i++) {
        if (nameOfProducts[i].innerText.trim() === titleProduct.trim()) {
            var rowElement = nameOfProducts[i].closest("tr");
            if (rowElement) {
                var inputElement = rowElement.querySelector(".quantity-cart-product");
                if (inputElement) {
                    var currentValue = parseInt(inputElement.value) || 0;
                    inputElement.value = (currentValue + 1).toString();
                }
            }
            updateTotal();
            return;
        }
    }
    var newElementTr = document.createElement("tr");
    newElementTr.classList.add("product-in-cart");
    newElementTr.innerHTML = "\n    <td class=\"pb-4 \">\n        <div class=\"w-24 p-1 bg-orange-100 rounded-md\">\n            <strong class=\"title-product-cart uppercase tracking-wider text-orange-800 text-center text-sm sm:text-base\">".concat(titleProduct, "</strong>\n            <img class=\"rounded-md\" src=\"").concat(imagesOfProducts, "\" alt=\"").concat(titleProduct, "\">\n        </div>\n    </td>\n\n    <td>\n      <span class=\"price-product-cart text-gray-500 font-bold\">").concat(priceProduct, "</span>\n    </td>\n\n    <td>\n      <input class=\"quantity-cart-product w-16 outline-none border-none rounded-md text-center text-gray-700 font-bold p-1\" type=\"number\" placeholder=\"\" value=\"1\">\n    </td>\n\n    <td>\n      <button class=\"remove-product-cart w-5 h-5 flex justify-center items-center p-3 bg-orange-200 border border-orange-700 rounded-full text-white\">X</button>\n    </td>\n  ");
    var addInTbody = document.querySelector(".table-cart tbody");
    addInTbody === null || addInTbody === void 0 ? void 0 : addInTbody.append(newElementTr);
    updateTotal();
    newElementTr.querySelectorAll(".quantity-cart-product")[0].addEventListener("change", checkValueInput);
    newElementTr.querySelectorAll(".remove-product-cart")[0].addEventListener("click", removeItem);
    if (shoppingCart) {
        shoppingCart.classList.add("active");
    }
}
//--------------
//--------------
//remover o produto do carrinho
function removeItem(event) {
    var target = event.target;
    var elementProduct = target.closest(".product-in-cart");
    if (elementProduct && shoppingCart) {
        shoppingCart.classList.remove("active");
        elementProduct.remove();
    }
    updateTotal();
}
//--------------
//Atualizando o valor dos produtos dentro do carrinho
function updateTotal() {
    totalValue = 0;
    var updateValueCart = document.querySelectorAll(".product-in-cart");
    for (var i = 0; i < updateValueCart.length; i++) {
        var priceProductCart = updateValueCart[i].querySelectorAll(".price-product-cart")[0].innerText.replace("R$", "").replace(",", ".");
        var inputQuantityCart = updateValueCart[i].querySelectorAll(".quantity-cart-product")[0].value;
        totalValue += +priceProductCart * +inputQuantityCart;
    }
    totalValue = "".concat(totalValue.toFixed(2).replace(".", ","));
    var updateSpanValue = document.querySelector(".total-price span");
    if (updateSpanValue) {
        updateSpanValue.innerText = "R$ ".concat(totalValue.toString());
    }
}
//--------------
//--------------
function finalizePurchases() {
    var notification = document.createElement("div");
    var btnAlert = document.createElement("button");
    if (totalValue <= "0,00") {
        notification.classList.add("alert");
        notification.querySelector("alert");
        if (notification) {
            notification.setAttribute("style", "\n          position:absolute;\n          padding:3rem;\n          text-align:center;\n          margin-left:-9rem;\n          border-radius:10px;\n          letter-spacing:3px;\n          transition:0.3s;\n          top:200px;\n          left:50%;\n          color:#FFFFFF;\n          z-index:999;\n          background-color:#9a3412;\n          box-shadow: 0 5px 3px 5px rgba(0, 0, 0, 0.5);\n     \n          ");
            notification.innerText = "Seu carrinho está vazio!";
            document.body.appendChild(notification);
            btnAlert.classList.add("btn-alert");
            btnAlert.querySelector("btn-alert");
            btnAlert.setAttribute("style", "\n          width:25px;\n          heigth:25px;\n          position:absolute;\n          border-radius:100%;\n          border: solid white 1px;\n          font-weight:bold;\n          background-color:orange;\n          color:#ea580c;\n          box-shadow: 0 2px 1px 2px rgba(0, 0, 0, 0.1);\n          z-index:1000;\n          top:205px;\n          left:50%;\n  \n          ");
            btnAlert.innerText = "X";
            document.body.appendChild(btnAlert);
        }
        if (btnAlert && shoppingCart) {
            btnAlert.addEventListener("click", function () {
                notification.style.display = "none";
                btnAlert.style.display = "none";
                shoppingCart.classList.remove("active");
                fade === null || fade === void 0 ? void 0 : fade.classList.toggle("hide");
            });
        }
        fade === null || fade === void 0 ? void 0 : fade.classList.toggle("hide");
    }
    else {
        notification.classList.add("alert");
        notification.querySelector("alert");
        if (notification) {
            notification.setAttribute("style", "\n          position:absolute;\n          padding:1rem;\n          text-align:center;\n          margin-left:-9.7rem; \n          border-radius:10px;\n          border:1px solid orange;\n          letter-spacing:2px;\n          font-size:16px;\n          text-align: justify;\n          top:32%;\n          left:50%;\n          color:#FFFFFF;\n          z-index:999;\n          background-color:#16a34a;\n          box-shadow: 0 5px 3px 5px rgba(0, 0, 0, 0.5);\n     \n          ");
            notification.innerText =
                "\n          Agradecemos pela prefr\u00EAncia!\n\n          O valor da sua compra \u00E9: R$: ".concat(totalValue, "\n          Aperte em OK e fa\u00E7a seu pagamento \n          via Pix no c\u00F3digo QR que ir\u00E1 aparecer!\n\n          Volte sempre \uD83D\uDE0A !;\n\n          ");
            document.body.appendChild(notification);
            btnAlert.classList.add("btn-alert");
            btnAlert.querySelector("btn-alert");
            btnAlert.setAttribute("style", "\n          width:40px;\n          heigth:40px;\n          position:absolute;\n          border-radius:10px;\n          border: solid white 1px;\n          font-weight:bold;\n          margin-left:5rem;\n          \n          background-color:orange;\n          color:#ea580c;\n          box-shadow: 0 2px 1px 2px rgba(0, 0, 0, 0.1);\n          z-index:1000;\n          left:50%;\n          top:50%;\n\n          ");
            btnAlert.innerText = "OK";
            document.body.appendChild(btnAlert);
        }
        toggleModal();
        if (btnAlert && shoppingCart) {
            btnAlert.addEventListener("click", function () {
                notification.style.display = "none";
                btnAlert.style.display = "none";
                fade === null || fade === void 0 ? void 0 : fade.classList.toggle("hide");
            });
        }
        fade === null || fade === void 0 ? void 0 : fade.classList.toggle("hide");
    }
}
//--------------
//--------------
//Função para abrir e fechar o modal de pagamento pix
function toggleModal() {
    modal === null || modal === void 0 ? void 0 : modal.classList.toggle("hide");
    fade === null || fade === void 0 ? void 0 : fade.classList.toggle("hide");
}
