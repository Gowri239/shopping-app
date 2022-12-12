
const orderContent = document.getElementById('order-content');

window.addEventListener('DOMContentLoaded', ()=>{
    axios.get('http://54.173.238.58:4000/orders').then((result)=>{
        if(result.data.orders.length <= 0){
            orderContent.innerHTML = 'No Orders Uptill now'            
        }else{
            result.data.orders.reverse().map(order=>{
                displayOrders(order);
            })
        }
    })
    .catch((err)=>{
        console.log(err)
    })

})

function displayOrders(order){
    let newOrderDetail = `<div id=${order.id} class="order-style" ><h2>Order Id - ${order.id}</h2></div>`

    orderContent.innerHTML += newOrderDetail ;

    orderedProducts(order);
}

function orderedProducts(order){
    let orderList = document.getElementById(`${order.id}`);
    
    order.products.map(product=>{
        let items = `<ul><li><img src="${product.imageUrl}"><br/> ${product.title}  x  ${product.orderItem.quantity}</li></ul>`
        orderList.innerHTML += items
    })
}