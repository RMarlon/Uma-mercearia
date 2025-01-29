var items = document.querySelectorAll(".items");
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
});
