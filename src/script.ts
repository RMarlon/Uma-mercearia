const closedModalBtn =
  document.querySelector<HTMLButtonElement>("#close-modal");
const shoppingCart = document.getElementById(
  "shopping-cart"
) as unknown as HTMLElement | null;
const fade = document.querySelector<HTMLElement>("#fade");
const modal = document.querySelector<HTMLElement>("#modal");

//--------------
let totalValue: string | number = "0,00";
//--------------
//Verificando se o HTML do DOM já foi carregado
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    loading
  ) as unknown as HTMLElement;
} else {
  loading();
}
//--------------

//--------------
// Eventos que vão rodar apenas quando o DOM estiver carregado
function loading() {
  //--------------
  //Pegando o botão de remover o produto
  const removeProductCartBtn = document.querySelectorAll<HTMLButtonElement>(
    ".remove-product-cart"
  );
  for (let i = 0; i < removeProductCartBtn.length; i++) {
    removeProductCartBtn[i].addEventListener("click", removeItem);
  }
  //--------------

  //--------------
  //Peganquando os inputs de quantidade
  const quantityInputCart = document.querySelectorAll<HTMLInputElement>(
    ".quantity-cart-product"
  );
  for (let i = 0; i < quantityInputCart.length; i++) {
    quantityInputCart[i].addEventListener("change", checkValueInput);
  }
  //--------------

  //--------------
  //Pegando o botão de adicionar o produto ao carrinho
  const buttonAddCart =
    document.querySelectorAll<HTMLButtonElement>(".add-cart-button");
  for (let i = 0; i < buttonAddCart.length; i++) {
    buttonAddCart[i].addEventListener("click", addProductCart);
  }
  //--------------

  //--------------
  //Evento click para abrir o modal de pagamento por pix
  const buttonPay = document.querySelector<HTMLButtonElement>("#payment");
  buttonPay?.addEventListener("click", () => {
    finalizePurchases();
  });
  //--------------

  //--------------
  //Evento click que verifica se tem algum item no carrinho
  const btnImgCart = document.querySelector<HTMLButtonElement>(".btn-img-cart");
  btnImgCart?.addEventListener("click", () => {
    if (totalValue === "0,00") {
      finalizePurchases();
    }
  });

  //--------------
  //--------------
  //Evendo de click para fechar o modal de pagamento por pix
  [closedModalBtn, fade].forEach((element) => {
    element?.addEventListener("click", () => {
      const concluedPay = document.querySelector(".table-cart tbody");
      if (concluedPay && shoppingCart) {
        concluedPay.innerHTML = "";
        shoppingCart.classList.remove("active");
      }
      toggleModal();
      updateTotal();
    });
  });
  //--------------
  //--------------
  //Evento de click que copia a chava pix ao clicar no botão
  const inputCopy = document.querySelector<HTMLInputElement>("#pixCode");
  const btnPixCopy = document.querySelector<HTMLButtonElement>("#btn-pix-copy");
  btnPixCopy?.addEventListener("click",  () => {
    if (inputCopy) {
      inputCopy.select();
      navigator.clipboard.writeText(inputCopy.value);
    }
  });
}
//--------------

//--------------
//Remove o produto do carrinho quando input for zero
function checkValueInput(event: any) {
  const targetValue = event.target as HTMLInputElement;
  const elementTarget = targetValue.closest(".product-in-cart");

  if (targetValue.value <= "0" && elementTarget) {
    elementTarget.remove();
  }
  updateTotal();
}
//--------------

//--------------
//Adicionando o produto no carrinho
function addProductCart(element: any) {
  const buttonOfAddCart = element.target;
  const infoProducts = buttonOfAddCart.parentElement.parentElement;
  const imagesOfProducts =
    infoProducts.querySelectorAll(".image-product")[0].src;
  const titleProduct =
    infoProducts.querySelectorAll(".title-product")[0].innerText;
  const priceProduct =
    infoProducts.querySelectorAll(".product-price")[0].innerText;

  const nameOfProducts = document.querySelectorAll<HTMLElement>(
    ".title-product-cart"
  );
  for (let i = 0; i < nameOfProducts.length; i++) {
    if (nameOfProducts[i].innerText.trim() === titleProduct.trim()) {
      const rowElement = nameOfProducts[i].closest("tr");

      if (rowElement) {
        const inputElement = rowElement.querySelector<HTMLInputElement>(
          ".quantity-cart-product"
        );

        if (inputElement) {
          let currentValue = parseInt(inputElement.value) || 0;
          inputElement.value = (currentValue + 1).toString();
        }
      }
      updateTotal();
      return;
    }
  }

  let newElementTr = document.createElement("tr");
  newElementTr.classList.add("product-in-cart");

  newElementTr.innerHTML = `
    <td class="pb-4 ">
        <div class="w-24 p-1 bg-orange-100 rounded-md">
            <p class="title-product-cart tracking-wider text-orange-800 text-center text-sm sm:text-base">${titleProduct}</p>
            <img class="rounded-md" src="${imagesOfProducts}" alt="${titleProduct}">
        </div>
    </td>

    <td>
      <span class="price-product-cart text-gray-500 font-bold">${priceProduct}</span>
    </td>

    <td>
      <input class="quantity-cart-product w-16 outline-none border-none rounded-md text-center text-gray-700 font-bold p-1" type="number" placeholder="" value="1">
    </td>

    <td>
      <button class="remove-product-cart w-5 h-5 flex justify-center items-center p-3 bg-orange-200 border border-orange-700 rounded-full text-white">X</button>
    </td>
  `;

  const addInTbody = document.querySelector<HTMLElement>(".table-cart tbody");
  addInTbody?.append(newElementTr);

  updateTotal();

  newElementTr
    .querySelectorAll<HTMLInputElement>(".quantity-cart-product")[0]
    .addEventListener("change", checkValueInput);
  newElementTr
    .querySelectorAll<HTMLButtonElement>(".remove-product-cart")[0]
    .addEventListener("click", removeItem);

  if (shoppingCart) {
    shoppingCart.classList.add("active");
  }
}
//--------------

//--------------
//remover o produto do carrinho
function removeItem(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const elementProduct = target.closest("tr");

  if (elementProduct) {
    elementProduct.remove();
    updateTotal();
  }
}

//--------------

//Atualizando o valor dos produtos dentro do carrinho
function updateTotal() {
  totalValue = 0;

  const updateValueCart =
    document.querySelectorAll<HTMLElement>(".product-in-cart");
  for (let i = 0; i < updateValueCart.length; i++) {
    const priceProductCart = updateValueCart[i]
      .querySelectorAll<HTMLSpanElement>(".price-product-cart")[0]
      .innerText.replace("R$", "")
      .replace(",", ".");
    const inputQuantityCart = updateValueCart[
      i
    ].querySelectorAll<HTMLInputElement>(".quantity-cart-product")[0].value;

    totalValue += +priceProductCart * +inputQuantityCart;
  }

  totalValue = `${totalValue.toFixed(2).replace(".", ",")}`;

  const updateSpanValue =
    document.querySelector<HTMLSpanElement>(".total-price span");
  if (updateSpanValue) {
    updateSpanValue.innerText = `R$ ${totalValue.toString()}`;
  }

  if (totalValue === "0,00") {
    shoppingCart?.classList.remove("active");
  }
}
//--------------

//--------------
function finalizePurchases() {
  let notification = document.createElement("div");
  let btnAlert = document.createElement("button");

  if (totalValue <= "0,00") {
    notification.classList.add("alert");
    notification.querySelector<HTMLDivElement>("alert");

    if (notification as HTMLDivElement) {
      notification.setAttribute(
        "style",
        `
          position:relative;
          position:fixed;
          max-width:340px;
          padding:2.7rem;
          text-align:center;
          margin:0 -10rem;
          border-radius:10px;
          letter-spacing:3px;
          transition:0.3s;
          top:200px;
          left:50%;
          color:#FFFFFF;
          z-index:999;
          background-color:#9a3412;
          box-shadow: 0 5px 3px 5px rgba(0, 0, 0, 0.5);
     
          `
      );
      notification.innerText = "Seu carrinho está vazio! 😔";
      document.body.appendChild(notification);

      btnAlert.classList.add("btn-alert");
      btnAlert.querySelector<HTMLButtonElement>("btn-alert");
      btnAlert.setAttribute(
        "style",
        `
          position:relative;
          width:25px;
          heigth:25px;
          position:fixed;
          border-radius:100%;
          margin-left: 9rem;
          border: solid white 1px;
          font-weight:bold;
          background-color:orange;
          color:#ea580c;
          box-shadow: 0 2px 1px 2px rgba(0, 0, 0, 0.1);
          z-index:1000;
          top:205px;
          left:50%;
  
          `
      );
      btnAlert.innerText = "X";
      document.body.appendChild(btnAlert);
    }
    if (btnAlert && shoppingCart) {
      btnAlert.addEventListener("click", () => {
        notification.style.display = "none";
        btnAlert.style.display = "none";
        shoppingCart.classList.remove("active");
        fade?.classList.toggle("hide");
      });
    }
    fade?.classList.toggle("hide");
  } else {
    notification.classList.add("alert");
    notification.querySelector<HTMLDivElement>("alert");

    if (notification as HTMLDivElement) {
      notification.setAttribute(
        "style",
        `
          position:relative;
          position:fixed;
          padding:1rem;
          margin: 0 -11rem;
          text-align:center;
          border-radius:10px;
          border:1px solid orange;
          letter-spacing:2px;
          font-size:16px;
          text-align: justify;
          top:180px;
          left:50%;
          color:#FFFFFF;
          z-index:999;
          background-color:#16a34a;
          box-shadow: 0 5px 3px 5px rgba(0, 0, 0, 0.5);
     
          `
      );
      notification.innerText = `
          Agradecemos pela prefrência!

          O valor da sua compra é de R$: ${totalValue}
          Aperte em OK e faça seu pagamento 
          via Pix no código QR que irá aparecer!

          Volte sempre! 😊

          `;
      document.body.appendChild(notification);

      btnAlert.classList.add("btn-alert");
      btnAlert.querySelector<HTMLButtonElement>("btn-alert");
      btnAlert.setAttribute(
        "style",
        `
          position:relative;
          position:fixed;
          width:80px;
          display:flex;
          justify-content: center;
          align-items:center;
          border-radius:10px;
          border: solid white 1px;
          font-weight:bold;
          margin:-1rem 5rem;
          background-color:orange;
          color:#ea580c;
          box-shadow: 0 2px 1px 2px rgba(0, 0, 0, 0.1);
          z-index:1000;
          left:50%;
          top:385px;
          

          `
      );
      btnAlert.innerText = "OK";
      document.body.appendChild(btnAlert);
    }
    toggleModal();

    if (btnAlert && shoppingCart) {
      btnAlert.addEventListener("click", () => {
        notification.style.display = "none";
        btnAlert.style.display = "none";
        fade?.classList.toggle("hide");
      });
    }
    fade?.classList.toggle("hide");
  }
}
//--------------

//--------------
//Função para abrir e fechar o modal de pagamento pix
function toggleModal() {
  modal?.classList.toggle("hide");
  fade?.classList.toggle("hide");
}
