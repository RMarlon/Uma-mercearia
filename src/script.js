var items = document.querySelectorAll(".items");
var closedModalBtn = document.querySelector("#close-modal");
var shoppingCart = document.getElementById("shopping-cart");
var buttonPay = document.querySelector("#payment");
var fade = document.querySelector("#fade");
var modal = document.querySelector("#modal");
var car = document.querySelector(".car");
items.forEach(function (product) {
    var _a;
    var btnLess = product.querySelector(".btn-less");
    var btnMore = product.querySelector(".btn-more");
    var quatity = product.querySelector(".quantity");
    var price = product.querySelector(".price");
    var addCart = product.querySelector(".add-cart");
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
    addCart === null || addCart === void 0 ? void 0 : addCart.addEventListener("click", function () {
        car === null || car === void 0 ? void 0 : car.classList.add("");
    });
});
car === null || car === void 0 ? void 0 : car.addEventListener("click", function () {
    if (shoppingCart) {
        shoppingCart.style.display =
            shoppingCart.style.display === "block" ? "none" : "block";
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
