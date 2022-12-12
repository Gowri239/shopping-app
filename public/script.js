const cart_items = document.querySelector('.cart-items');

const parentContainer = document.getElementById('EcommerceContainer');

// for pagination
const parentNode = document.getElementById('product_content');

const pagination = document.getElementById('pagination');

const cartpagination = document.getElementById('cart_pagination')

let page = 1 ; 

// for getting products on screen
window.addEventListener('DOMContentLoaded', () => {
    let page = 1 ; 
    getProducts(page);
})

function getProducts(page){
    axios.get(`http://54.173.238.58:4000/products/?page=${page}`).then((response) => {
            showProductsOnScreen(response.data.products);
            showPagination(response.data);
        })
    }

function showProductsOnScreen(productsData){
    parentNode.innerHTML = ''
    productsData.forEach((product) => {
    const prod = document.createElement('div')
        prod.innerHTML = `<div id="${product.id}">
                                <h3>${product.title}</h3>
                                <div class="image-container">
                                    <img class="prod-images" src=${product.imageUrl} alt=" ">
                                </div>
                                <div class="prod-details">
                                    <span>$<span>${product.price}</span></span>
                                    <button class="shop-item-button">ADD TO CART</button>
                                </div>
                            </div>`
        parentNode.appendChild(prod)      
      })   
}

// pagination for products
function showPagination({currentPage,hasNextPage,hasPreviousPage,nextPage,previousPage}){

    pagination.innerHTML ='';

    if(hasPreviousPage){
        const button1 = document.createElement('button');
        button1.innerHTML = previousPage ;
        button1.addEventListener('click' , ()=>getProducts(previousPage))
        pagination.appendChild(button1)
    }

    const button2 = document.createElement('button');
    button2.classList.add('active')
    button2.innerHTML = currentPage ;
    button2.addEventListener('click' , ()=>getProducts(currentPage))
    pagination.appendChild(button2)

    if(hasNextPage){
        const button3 = document.createElement('button');
        button3.innerHTML = nextPage ;
        button3.addEventListener('click' , ()=>getProducts(nextPage))
        pagination.appendChild(button3)
    }
}

// for clicking various buttons on screen
parentContainer.addEventListener('click',(e)=>{
    // if clicks on add to cart
    if (e.target.className=='shop-item-button'){
        const prodId = e.target.parentNode.parentNode.id
        axios.post("http://54.173.238.58:4000/cart",{productId: prodId})
        .then((response) => {
            if(response.status === 200){
                notifyUsers(response.data.message)
            }else{
                throw new Error(response.data.message)
            }
        })
        .catch((errMsg) => {
            console.log(errMsg)
            notifyUsers(errMsg)
        })
    }

    // if clicks on seecart or cart button in top
    if (e.target.className=='cart-btn-bottom' || e.target.className=='cart-bottom' || e.target.className=='cart-holder'){
        getcartDetails(page)
    }

    // if clicks on X in cart (to close cart)
    if (e.target.className=='cancel'){
        document.querySelector('#cart').style = "display:none;"
    }
    
    // if clicks on ordernow button to order
    if(e.target.className=='purchase-btn'){
        addToOrders()
        alert("Thanks for purchasing")
    }
    
    // if clicks on remove to remove product from cart
    if (e.target.innerText=='REMOVE'){
        let total_cart_price = document.querySelector('#total-value').innerText;
        total_cart_price = parseFloat(total_cart_price).toFixed(2) - parseFloat(document.querySelector(`#${e.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2) ;  
        document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
    }
})

// show products in cart
function getcartDetails(page){
    axios.get(`http://54.173.238.58:4000/cart/?page=${page}`)
        .then(response => {
            console.log(response)
            cart_items.innerHTML = " "
            // let total_cart_price = document.querySelector('#total-value').innerText;
            let total_cart_price = 0
            if(response.status === 200){
                response.data.products.forEach(product => {
                    
                    const id = `${product.id}`
                    const name = product.title
                    const img_src = product.imageUrl
                    const price = product.price
                    total_cart_price = parseFloat(total_cart_price) + parseFloat(price)
                    total_cart_price = total_cart_price.toFixed(2)
                    const cart_item = document.createElement('div');
                    cart_item.classList.add('cart-row');
                    cart_item.setAttribute('id',`in-cart-${id}`);
                    cart_item.innerHTML = `<span class='cart-item cart-column'>
                    <img class='cart-img' src="${img_src}" alt="">
                        <span>${name}</span>
                    </span>
                    <span class='cart-price cart-column'>${price}</span>
                    <span class='cart-quantity cart-column'>
                        <input type="text" value="1">
                        <button id="btn1" onClick="deleteItemInCart(${product.id})">REMOVE</button>
                    </span>`
                    cart_items.appendChild(cart_item)
                })
                document.querySelector('.total-price').innerText = total_cart_price
                cartPagination(response.data)
                document.querySelector('#cart').style = "display:block" 
            }else{
                throw new Error('something went wrong')

            }
        })
        .catch(err => notifyUsers(err))
}

function deleteItemInCart(prodId){
    axios.post('http://54.173.238.58:4000/cart-delete-item', {productId: prodId})
         .then(() =>{
            removeItemFromCart(prodId)
         } )
}

function removeItemFromCart(prodId){
    document.getElementById(`in-cart-${prodId}`).remove();
}

function cartPagination({currentPage,hasNextPage,hasPreviousPage,nextPage,previousPage}){
    cartpagination.innerHTML ='';
    
    if(hasPreviousPage){
        const button1 = document.createElement('button');
        button1.innerHTML = previousPage ;
        button1.addEventListener('click' , ()=>getcartDetails(previousPage))
        cartpagination.appendChild(button1)
    }

    const button2 = document.createElement('button');
    button2.classList.add('active')
    button2.innerHTML = currentPage ;
    button2.addEventListener('click' , ()=>getcartDetails(currentPage))
    cartpagination.appendChild(button2)

    if(hasNextPage){
        const button3 = document.createElement('button');
        button3.innerHTML = nextPage ;
        console.log(nextPage)
        button3.addEventListener('click' , ()=>getcartDetails(nextPage))
        cartpagination.appendChild(button3)
    }

}

function addToOrders(){
    axios.post("http://54.173.238.58:4000/create-order")
        .then((response) => {
            if(response.status === 200){
                notifyUsers(response.data.message)
            }else{
                throw new Error(response.data.message)
            }
        })
        .catch((errMsg) => {
            console.log(errMsg)
            notifyUsers(errMsg)
        })
}

function notifyUsers(message){
    const container = document.getElementById('container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `${message}`;
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
    },2000)

}









