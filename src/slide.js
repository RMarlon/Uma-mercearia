var _a;
var currentSlider = 0;
var totalSlides = document.querySelectorAll("#slider-tems").length;
var sliderBtn = document.querySelector("#slider-controls");
var sliderWidth = document.querySelector("#slider-width");
if (sliderWidth) {
    sliderWidth.style.width = "calc(100vw * ".concat(totalSlides, ")");
}
if (sliderBtn) {
    sliderBtn.style.height = "".concat((_a = document.querySelector("#slider")) === null || _a === void 0 ? void 0 : _a.clientHeight, "px");
}
function goBack() {
    currentSlider--;
    if (currentSlider < 0) {
        currentSlider = totalSlides - 1;
    }
    updateMargin();
}
function goNext() {
    currentSlider++;
    if (currentSlider > totalSlides - 1) {
        currentSlider = 0;
    }
    updateMargin();
}
function updateMargin() {
    var newMargin = currentSlider * document.body.clientWidth;
    sliderWidth.style.marginLeft = "-".concat(newMargin, "px");
}
setInterval(goNext, 2000);
