// Elementos do DOM
const elements = {
  closedModalBtn: document.querySelector<HTMLButtonElement>("#close-modal"),
  shoppingCart: document.getElementById("shopping-cart"),
  fade: document.querySelector<HTMLElement>("#fade"),
  modal: document.querySelector<HTMLElement>("#modal"),
  buttonPay: document.querySelector<HTMLButtonElement>("#payment"),
  btnImgCart: document.querySelector<HTMLButtonElement>(".btn-img-cart"),
  inputCopy: document.querySelector<HTMLInputElement>("#pixCode"),
  btnPixCopy: document.querySelector<HTMLButtonElement>("#btn-pix-copy"),
  countCart: document.querySelector<HTMLDivElement>('#count-cart'),
  btnLess: document.querySelector<HTMLButtonElement>('#btn-less'),
  btnMore: document.querySelector<HTMLButtonElement>('#btn-more'),
  qtd: document.querySelector<HTMLElement>('#qtd'),
  priceItem: document.querySelector<HTMLSpanElement>('.product-price')
};

// Estado da aplicação
let totalValue: number = 0;
let currentQuantity: number = 1;
const unitPriceText = elements.priceItem?.textContent || 'R$ 0,00';
const unitPrice = parseFloat(unitPriceText.replace('R$', '').trim().replace(/\./g, '').replace(',', '.')) || 0;

// Inicialização
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function init() {
  updatePrice(currentQuantity);
  setupEventListeners();
  setupQuantityControls();
}

function setupEventListeners() {
  // Botões de remover produto
  document.querySelectorAll<HTMLButtonElement>(".remove-product-cart")
    .forEach(btn => btn.addEventListener("click", removeItem));

  // Inputs de quantidade
  document.querySelectorAll<HTMLInputElement>(".quantity-cart-product")
    .forEach(input => {
      input.addEventListener("change", (e) => {
        checkValueInput(e);
        updateProductPriceInCart(e);
      });
      input.min = "1";
    });

  // Botões de aumentar quantidade no carrinho
  document.querySelectorAll<HTMLButtonElement>(".increase-quantity")
    .forEach(btn => btn.addEventListener("click", handleIncreaseQuantity));

  // Botões de diminuir quantidade no carrinho
  document.querySelectorAll<HTMLButtonElement>(".decrease-quantity")
    .forEach(btn => btn.addEventListener("click", handleDecreaseQuantity));

  // Botões de adicionar ao carrinho
  document.querySelectorAll<HTMLButtonElement>(".add-cart-button")
    .forEach(btn => btn.addEventListener("click", addProductCart));

  // Botão de pagamento
  elements.buttonPay?.addEventListener("click", () => finalizePurchases());

  // Botão do carrinho
  elements.btnImgCart?.addEventListener("click", () => {
    if (totalValue === 0) {
      finalizePurchases();
    }
  });

  // Fechar modal
  [elements.closedModalBtn, elements.fade].forEach(el => {
    el?.addEventListener("click", () => {
      clearCart();
      toggleModal();
    });
  });

  // Copiar código PIX
  elements.btnPixCopy?.addEventListener("click", () => {
    if (elements.inputCopy) {
      elements.inputCopy.select();
      navigator.clipboard.writeText(elements.inputCopy.value);
    }
  });
}

// Funções para manipular quantidade no carrinho
function handleIncreaseQuantity(event: Event) {
  const button = event.target as HTMLButtonElement;
  const input = button.closest('td')?.querySelector<HTMLInputElement>('.quantity-cart-product');
  
  if (input) {
    input.value = (parseInt(input.value) + 1).toString();
    const changeEvent = new Event('change');
    input.dispatchEvent(changeEvent);
  }
}

function handleDecreaseQuantity(event: Event) {
  const button = event.target as HTMLButtonElement;
  const input = button.closest('td')?.querySelector<HTMLInputElement>('.quantity-cart-product');
  
  if (input && parseInt(input.value) > 1) {
    input.value = (parseInt(input.value) - 1).toString();
    const changeEvent = new Event('change');
    input.dispatchEvent(changeEvent);
  }
}

function clearCart(): void {
  const cartBody = document.querySelector<HTMLTableSectionElement>(".table-cart tbody");
  if (cartBody) {
    cartBody.innerHTML = "";
  }
  totalValue = 0;
  updateTotal();
  updateCartCount();
  elements.shoppingCart?.classList.remove("active");
}

function updateProductPriceInCart(event: Event) {
  const input = event.target as HTMLInputElement;
  const productRow = input.closest<HTMLTableRowElement>(".product-in-cart");
  
  if (!productRow) return;

  const priceElement = productRow.querySelector<HTMLElement>(".price-product-cart");
  const quantity = parseInt(input.value) || 1;
  
  if (priceElement) {
    const newPrice = unitPrice * quantity;
    priceElement.textContent = `R$ ${formatCurrency(newPrice)}`;
    input.dataset.lastQuantity = quantity.toString();
  }
  
  updateTotal();
}

function setupQuantityControls() {
  elements.btnMore?.addEventListener('click', () => {
    currentQuantity += 1;
    updateQuantityDisplay();
    updatePrice(currentQuantity);
  });

  elements.btnLess?.addEventListener('click', () => {
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

function updatePrice(quantity: number) {
  if (elements.priceItem) {
    const totalPrice = unitPrice * quantity;
    elements.priceItem.textContent = `R$ ${formatCurrency(totalPrice)}`;
  }
}

function checkValueInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const productElement = target.closest<HTMLTableRowElement>(".product-in-cart");

  if (target.value === "0" && productElement) {
    productElement.remove();
  }
  updateTotal();
  updateCartCount();
}

function updateCartCount() {
  const quantities = document.querySelectorAll<HTMLInputElement>('.quantity-cart-product');
  let totalItems = 0;
  
  quantities.forEach(input => {
    totalItems += parseInt(input.value) || 0;
  });

  if (elements.countCart) {
    elements.countCart.innerText = totalItems.toString();
  }
}

function addProductCart(event: Event) {
  const button = event.target as HTMLButtonElement;
  const productInfo = button.closest<HTMLElement>(".product") || button.parentElement?.parentElement;
  
  if (!productInfo) return;

  const productImage = productInfo.querySelector<HTMLImageElement>(".image-product")?.src;
  const productTitle = productInfo.querySelector<HTMLElement>(".title-product")?.innerText?.trim();
  const productPrice = `R$ ${formatCurrency(unitPrice * currentQuantity)}`;

  if (!productImage || !productTitle || !productPrice) return;

  const existingProduct = Array.from(document.querySelectorAll<HTMLElement>(".title-product-cart"))
    .find(el => el.innerText.trim() === productTitle);

  if (existingProduct) {
    const productRow = existingProduct.closest<HTMLTableRowElement>("tr");
    const input = productRow?.querySelector<HTMLInputElement>(".quantity-cart-product");
    if (input && productRow) {
      const currentValue = parseInt(input.value) || 0;
      input.value = (currentValue + currentQuantity).toString();
      
      const priceElement = productRow.querySelector<HTMLElement>(".price-product-cart");
      if (priceElement) {
        const newPrice = unitPrice * parseInt(input.value);
        priceElement.textContent = `R$ ${formatCurrency(newPrice)}`;
      }
      
      updateTotal();
      return;
    }
  }

  const newRow = document.createElement("tr");
  newRow.classList.add("product-in-cart");
  newRow.innerHTML = `
    <td class="pb-4">
      <div class="w-24 p-1 bg-orange-100 rounded-md mr-3">
        <p class="title-product-cart tracking-wider text-orange-800 text-center text-xs pb-2">${productTitle}</p>
        <img class="rounded-md" src="${productImage}" alt="${productTitle}">
      </div>
    </td>
    <td>
      <span class="price-product-cart text-gray-500 text-xs font-semibold">${productPrice}</span>
    </td>
    <td>
      <div class="flex items-center justify-center">
        <button class="decrease-quantity w-6 h-6 flex items-center justify-center bg-orange-200 rounded-l-md hover:bg-orange-300 transition">
          -
        </button>
        <input class="quantity-cart-product w-10 outline-none border-y border-orange-200 text-center text-gray-700 font-bold" 
               type="number" 
               value="${currentQuantity}" 
               min="1"
               data-last-quantity="${currentQuantity}">
        <button class="increase-quantity w-6 h-6 flex items-center justify-center bg-orange-200 rounded-r-md hover:bg-orange-300 transition">
          +
        </button>
      </div>
    </td>
    <td>
      <button class="remove-product-cart w-5 h-5 flex justify-center items-center p-3 bg-orange-200 border border-orange-700 rounded-full text-white hover:bg-orange-300 transition">X</button>
    </td>
  `;

  const cartBody = document.querySelector<HTMLTableSectionElement>(".table-cart tbody");
  cartBody?.append(newRow);

  // Configura os event listeners para os novos elementos
  const quantityInput = newRow.querySelector<HTMLInputElement>(".quantity-cart-product");
  const increaseBtn = newRow.querySelector<HTMLButtonElement>(".increase-quantity");
  const decreaseBtn = newRow.querySelector<HTMLButtonElement>(".decrease-quantity");

  quantityInput?.addEventListener("change", (e) => {
    checkValueInput(e);
    updateProductPriceInCart(e);
  });

  increaseBtn?.addEventListener("click", handleIncreaseQuantity);
  decreaseBtn?.addEventListener("click", handleDecreaseQuantity);
  
  newRow.querySelector<HTMLButtonElement>(".remove-product-cart")?.addEventListener("click", removeItem);

  elements.shoppingCart?.classList.add("active");
  updateTotal();
  updateCartCount();
  
  currentQuantity = 1;
  updateQuantityDisplay();
  updatePrice(currentQuantity);
}

function removeItem(event: Event) {
  const target = event.target as HTMLElement;
  const productRow = target.closest<HTMLTableRowElement>("tr");
  
  if (productRow) {
    productRow.remove();
    updateTotal();
    updateCartCount();
  }
}

function updateTotal() {
  totalValue = 0;

  document.querySelectorAll<HTMLTableRowElement>(".product-in-cart").forEach(row => {
    const priceText = row.querySelector<HTMLElement>(".price-product-cart")?.innerText
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".") || "0";
    
    totalValue += parseFloat(priceText);
  });

  const totalElement = document.querySelector<HTMLSpanElement>(".total-price span");
  if (totalElement) {
    totalElement.innerText = `R$ ${formatCurrency(totalValue)}`;
  }

  if (totalValue === 0) {
    elements.shoppingCart?.classList.remove("active");
  }
}

function finalizePurchases(): void {
  const notification = document.createElement("div");
  const btnAlert = document.createElement("button");

  if (totalValue <= 0) {
    showEmptyCartNotification(notification, btnAlert);
  } else {
    showCheckoutNotification(notification, btnAlert);
  }
}

function showEmptyCartNotification(notification: HTMLDivElement, btnAlert: HTMLButtonElement): void {
  notification.className = "alert";
  notification.style.cssText = `
    position: fixed;
    max-width: 340px;
    padding: 2.7rem;
    text-align: center;
    margin: 0 -10rem;
    border-radius: 10px;
    letter-spacing: 3px;
    transition: 0.3s;
    top: 200px;
    left: 50%;
    color: #FFFFFF;
    z-index: 999;
    background-color: #9a3412;
    box-shadow: 0 5px 3px 5px rgba(0, 0, 0, 0.5);
  `;
  notification.innerText = "Seu carrinho está vazio! 😔";
  document.body.appendChild(notification);

  btnAlert.className = "btn-alert";
  btnAlert.style.cssText = `
    position: fixed;
    width: 25px;
    height: 25px;
    border-radius: 100%;
    margin-left: 9rem;
    border: solid white 1px;
    font-weight: bold;
    background-color: orange;
    color: #ea580c;
    box-shadow: 0 2px 1px 2px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    top: 205px;
    left: 50%;
  `;
  btnAlert.innerText = "X";
  document.body.appendChild(btnAlert);

  btnAlert.addEventListener("click", () => {
    notification.remove();
    btnAlert.remove();
    elements.shoppingCart?.classList.remove("active");
    toggleModal();
  });

  toggleModal();
}

function showCheckoutNotification(notification: HTMLDivElement, btnAlert: HTMLButtonElement): void {
  notification.className = "alert";
  notification.style.cssText = `
    position: fixed;
    padding: 1rem;
    margin: 0 -11rem;
    text-align: center;
    border-radius: 10px;
    border: 1px solid orange;
    letter-spacing: 2px;
    font-size: 16px;
    text-align: justify;
    top: 180px;
    left: 50%;
    color: #FFFFFF;
    z-index: 999;
    background-color: #16a34a;
    box-shadow: 0 5px 3px 5px rgba(0, 0, 0, 0.5);
  `;
  notification.innerHTML = `
    Agradecemos pela preferência!<br><br>
    O valor da sua compra é de R$: ${formatCurrency(totalValue)}<br>
    Aperte em OK e faça seu pagamento via Pix no código QR que irá aparecer!<br><br>
    Volte sempre! 😊
  `;
  document.body.appendChild(notification);

  btnAlert.className = "btn-alert";
  btnAlert.style.cssText = `
    position: fixed;
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    border: solid white 1px;
    font-weight: bold;
    margin: -1rem 5rem;
    background-color: orange;
    color: #ea580c;
    box-shadow: 0 2px 1px 2px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    left: 50%;
    top: 385px;
  `;
  btnAlert.innerText = "OK";
  document.body.appendChild(btnAlert);

  toggleModal();

  btnAlert.addEventListener("click", () => {
    clearCart();
    notification.remove();
    btnAlert.remove();
    toggleModal();
  });
}

function toggleModal(): void {
  if (elements.modal && elements.fade) {
    elements.modal.classList.toggle("hide");
    elements.fade.classList.toggle("hide");
  }
}

// Utilitários
function formatCurrency(value: number): string {
  return value.toFixed(2)
    .replace(".", ",")
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}