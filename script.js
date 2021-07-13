const baseUrl = 'https://api.mercadolibre.com/sites/MLB/';
const divFatherOl = document.querySelector('.cart__items');
const emptyCar = document.querySelector('.empty-cart');
const load = document.querySelector('.loading');
// const sectionCartStore = document.querySelector('.cart');
// const clear = document.querySelector('.empty-cart');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// recuperando função do localStorage

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }
 

// insere no local storage
function localStoraged() {
  const setItemLocalStorage = divFatherOl.innerHTML;
  localStorage.setItem('divFatherOl', JSON.stringify(setItemLocalStorage));
}

function cartItemClickListener(event) {
  event.target.remove(); 
  localStoraged();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getProducts() {
  return fetch(`${baseUrl}/search?q=computer`)
  .then((response) => response.json()); 
}

async function getProductId(event) {
  const id = event.target.previousSibling.previousSibling.previousSibling.innerText;
  const requisition = await fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json());
  divFatherOl.appendChild(createCartItemElement(requisition));
  localStoraged();
}

async function getItemButton() {
  const itemButton = document.querySelectorAll('.item__add');
  itemButton.forEach((button) => button.addEventListener('click', getProductId));
  // console.log(itemButton);
}

function getLocalStorage() {
  const getItem = localStorage.getItem('divFatherOl');
  divFatherOl.innerHTML = JSON.parse(getItem);
  const liList = document.querySelectorAll('.cart__item');
  liList.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
  console.log(liList);
} 

// Remover todos os itens da lista 
function removeAll() {
  divFatherOl.innerHTML = '';
}
emptyCar.addEventListener('click', removeAll);

window.onload = async () => {
  const product = await getProducts();
  product.results.forEach((produto) => {
    const element = createProductItemElement(produto);
    
    const items = document.querySelector('.items');
    items.appendChild(element);
  });
  load.remove();
  getItemButton();
  getLocalStorage();
};