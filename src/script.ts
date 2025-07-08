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
  pixModal: document.querySelector<HTMLElement>("#pix-modal"),
};

// Estado da aplicação
let totalValue: number = 0;

// Inicialização
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function init() {
  setupQuantityControls();
  setupEventListeners();
}

function setupQuantityControls() {
  document.querySelectorAll('.items').forEach(item => {
    const btnLess = item.querySelector('.btn-less') as HTMLButtonElement;
    const btnMore = item.querySelector('.btn-more') as HTMLButtonElement;
    const qtdElement = item.querySelector('.qtd') as HTMLElement;
    const priceElement = item.querySelector('.product-price') as HTMLElement;
    
    if (!btnLess || !btnMore || !qtdElement || !priceElement) return;

    // Obter preço unitário do data-attribute
    const unitPriceText = priceElement.getAttribute('data-unit-price') || '0';
    const unitPrice = parseFloat(unitPriceText);
    let currentQuantity = parseInt(qtdElement.textContent || '1');

    // Função para atualizar a exibição
    const updateDisplay = () => {
      qtdElement.textContent = currentQuantity.toString();
      const totalPrice = unitPrice * currentQuantity;
      priceElement.textContent = `R$ ${formatCurrency(totalPrice)}`;
    };

    // Evento para diminuir quantidade
    btnLess.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        updateDisplay();
      }
    });

    // Evento para aumentar quantidade
    btnMore.addEventListener('click', () => {
      currentQuantity++;
      updateDisplay();
    });
  });
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
      const notification = document.createElement("div");
      const btnAlert = document.createElement("button");
      showEmptyCartNotification(notification, btnAlert);
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
  const unitPriceText = priceElement?.textContent?.replace('R$', '').trim().replace(/\./g, '').replace(',', '.') || '0';
  const unitPrice = parseFloat(unitPriceText) / (parseInt(input.dataset.lastQuantity || '1') || 1);
  
  if (priceElement) {
    const newPrice = unitPrice * quantity;
    priceElement.textContent = `R$ ${formatCurrency(newPrice)}`;
    input.dataset.lastQuantity = quantity.toString();
  }
  
  updateTotal();
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
  const productItem = button.closest<HTMLElement>(".items");
  const productInfo = productItem?.querySelector<HTMLElement>(".all-products-move");
  
  if (!productInfo) return;

  // Obter a quantidade atual
  const qtdElement = productInfo.querySelector<HTMLElement>('.qtd');
  const currentQuantity = qtdElement ? parseInt(qtdElement.textContent || '1') : 1;

  const productImage = productInfo.querySelector<HTMLImageElement>(".image-product")?.src;
  const productTitle = productInfo.querySelector<HTMLElement>(".title-product")?.innerText?.trim();
  const priceElement = productInfo.querySelector<HTMLElement>(".product-price");
  const unitPriceText = priceElement?.getAttribute('data-unit-price') || '0';
  const unitPrice = parseFloat(unitPriceText);
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
  
  // Resetar quantidade para 1 após adicionar ao carrinho
  if (qtdElement) {
    qtdElement.textContent = '1';
    if (priceElement) {
      priceElement.textContent = `R$ ${formatCurrency(unitPrice * 1)}`;
    }
  }
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
  if (totalValue <= 0) {
    const notification = document.createElement("div");
    const btnAlert = document.createElement("button");
    showEmptyCartNotification(notification, btnAlert);
    return; // Adiciona este return para evitar que o modal do PIX apareça
  }

  // Mostra primeiro o modal de confirmação
  const notification = document.createElement("div");
  const btnAlert = document.createElement("button");
  showCheckoutNotification(notification, btnAlert, totalValue);
}


function showEmptyCartNotification(notification: HTMLDivElement, btnAlert: HTMLButtonElement): void {
  notification.className = "empty-cart-modal";
  notification.style.cssText = `
    position: fixed;
    max-width: 90%;
    width: 340px;
    padding: 2rem;
    text-align: center;
    border-radius: 10px;
    letter-spacing: 1px;
    transition: 0.3s;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    background-color: white;
    font-family: Arial, sans-serif;
    color: #5c2c0e;
  `;
  notification.innerHTML = `<p style="margin: 0; font-size: 1.1rem;">Seu carrinho está vazio! 😔</p>`;
  document.body.appendChild(notification);

  btnAlert.className = "close-empty-cart-btn";
  btnAlert.style.cssText = `
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #5c2c0e;
    color: white;
    border: none;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1001;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    top: -15px;
    right: -15px;
  `;
  btnAlert.innerText = "X";
  notification.appendChild(btnAlert);

  btnAlert.addEventListener("click", () => {
    notification.remove();
    elements.shoppingCart?.classList.remove("active");
    toggleModal();
  });

  toggleModal();
}

function showCheckoutNotification(notification: HTMLDivElement, btnAlert: HTMLButtonElement, totalValue: number): void {
  notification.className = "checkout-modal";
  notification.style.cssText = `
    position: fixed;
    max-width: 90%;
    width: 340px;
    padding: 2rem 2rem 3.5rem 2rem;
    text-align: left;
    border-radius: 10px;
    letter-spacing: 1px;
    transition: 0.3s;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1001; // Aumentado para 1001
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    background-color: white;
    font-family: Arial, sans-serif;
    color: #333;
    font-size: 16px;
    border: 1px solid #e0e0e0;
  `;
  notification.innerHTML = `
    <div style="color: #16a34a; font-weight: bold; text-align: center; margin-bottom: 1rem; font-size: 1.2rem;">
      Agradecemos pela preferência!
    </div>
    O valor da sua compra é de R$: ${formatCurrency(totalValue)}<br><br>
    Aperte em OK para visualizar o código PIX<br><br>
    Volte sempre! 😊
  `;
  document.body.appendChild(notification);

  btnAlert.className = "confirm-checkout-btn";
  btnAlert.style.cssText = `
    position: absolute;
    width: 100px;
    height: 40px;
    border-radius: 20px;
    background-color: #16a34a;
    color: white;
    border: none;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1002;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  `;
  btnAlert.innerText = "OK";
  notification.appendChild(btnAlert);

  toggleModal();

  btnAlert.addEventListener("click", () => {
    // Remove o modal de confirmação
    notification.remove();
    
    // Mostra o modal do PIX com z-index maior
    if (elements.pixModal) {
      elements.pixModal.style.zIndex = "1002"; 
      elements.pixModal.classList.remove("hide");
    }
    
    // Adiciona um botão para fechar o modal do PIX
    const closePixBtn = document.createElement("button");
    closePixBtn.textContent = "Fechar";
    closePixBtn.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 10px 20px;
      background-color: #9a3412;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    `;
    
    closePixBtn.addEventListener("click", () => {
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

function toggleModal(): void {
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
function formatCurrency(value: number): string {
  return value.toFixed(2)
    .replace(".", ",")
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}