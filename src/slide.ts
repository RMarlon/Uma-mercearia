let currentSlider = 0;

const totalSlides = document.querySelectorAll("#slider-tems").length;
const sliderBtn = document.querySelector("#slider-controls") as HTMLButtonElement;
const sliderWidth = document.querySelector("#slider-width") as HTMLElement;

if (sliderWidth) {
  sliderWidth.style.width = `calc(100vw * ${totalSlides})`;
}

if (sliderBtn) {
  sliderBtn.style.height = `${
    document.querySelector("#slider")?.clientHeight
  }px`;
}

function goBack(): void {
  currentSlider--;
  if (currentSlider < 0) {
    currentSlider = totalSlides - 1;
  }

  updateMargin();
}

function goNext(): void {
  currentSlider++;
  if (currentSlider > totalSlides - 1) {
    currentSlider = 0;
  }

  updateMargin();
}

function updateMargin(): void {
  const newMargin = currentSlider * document.body.clientWidth;
  sliderWidth.style.marginLeft = `-${newMargin}px`;
}

setInterval(goNext, 2000);