const items = document.querySelectorAll<HTMLElement>(".items");

items.forEach((product) => {
  const btnLess = product.querySelector<HTMLButtonElement>(".btn-less");
  const btnMore = product.querySelector<HTMLButtonElement>(".btn-more");
  const quatity = product.querySelector<HTMLSpanElement>(".quantity");
  const price = product.querySelector<HTMLSpanElement>(".price");

  if (!btnLess || !btnMore || !quatity || !price) return;

  let count: number = parseInt(quatity.textContent || "1", 10);
  let convertPrice: number = parseFloat(price.textContent?.replace("R$", "").trim() || "0");

  const updatePrice = () => {
    const priceNew = (convertPrice * count).toFixed(2);
    price.textContent = `R$ ${priceNew}`;
  };

  btnLess.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quatity.textContent = count.toString();
      updatePrice();
    }
  });

  btnMore.addEventListener("click", () => {
    count++;
    quatity.textContent = count.toString();
    updatePrice();
  });
});
