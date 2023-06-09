
function order(list, mode, cartType) {
    switch (mode) {
        case "whatsapp":
            orderOnWhatsapp(list, cartType);
            break;
    }
}

function orderOnWhatsapp(list, cartType) {
    console.log("Order on Whatsapp");
    var phoneNumber = getVendorNumber();
    var message = getSelfDetails() + "\n" + processListForWhatsapp(list);
    var encodedMessage = encodeURIComponent(message);
    console.log(encodedMessage)
    var whatsappUrl = "";
    if (phoneNumber != null) {
        whatsappUrl = "https://wa.me/" + phoneNumber + "?text=" + encodedMessage;
    }
    else {
        var whatsappUrl = "https://wa.me/" + "?text=" + encodedMessage;
    }

    window.open(whatsappUrl);
    localStorage.setItem(cartType + "cart", '{}'); //clear cart contents
}

function getSelfDetails() {

    var name = localStorage.getItem("name");
    var address = localStorage.getItem("address");
    if (name == null) {
        return address;
    }
    else {
        return "New order from " + name + "," + address;
    }
}

function setSelfDetails(name, address) {
    //add the values to local storage
    localStorage.setItem("name", name);
    localStorage.setItem("address", address);

}

function getVendorNumber(cartType) {
    var phoneNumber = localStorage.getItem("vendorNumber" + cartType);
    return phoneNumber;

}

function setVendorNumber(number, cartType) {
    //add the values to local storage
    localStorage.setItem("vendorNumber" + cartType, number);


}
function processListForWhatsapp(list) {
    list = JSON.parse(list)["items"];
    var message = "";
    message += "```";//for monospace
    for (var i = 0; i < list.length; i++) {
        message += list[i].itemName.padEnd(12) + list[i].quantity + " " + list[i].unit + "\n"; //padEnd adjusts the spaces to make a tablelike look
    }
    message += "```"; //for monospace

    console.log(message);
    return message;
}
function testDrive() {
    var list = '{ "items": [{ "itemName": "Carrot", "quantity": "1", "unit": "kg" }, { "itemName": "Broccoli", "quantity": "500", "unit": "grams" }, { "itemName": "Spinach", "quantity": "250", "unit": "grams" }, { "itemName": "Tomato", "quantity": "2", "unit": "kg" }, { "itemName": "Cucumber", "quantity": "3", "unit": "pieces" }, { "itemName": "Bell Pepper", "quantity": "3", "unit": "pieces" }, { "itemName": "Onion", "quantity": "1", "unit": "kg" }] }'
    order(localStorage.getItem("vegetablecart"), "whatsapp", "vegetable");


}

function init() {
    //init tasks
    setSelfDetails("Rahul", "Gurgaon");

    setVendorNumber("918879214633");
    makeItemList("vegetable");
    loadCartHTML("vegetable")
}

//cartType is "vegetable" or "grocery" etc
function makeItemList(cartType) {
    var itemList = loadItemArray(cartType);
    var HTMLStringToBeAdded = "";
    for (var i = 0; i < itemList.length; i++) {
        var itemData = itemList[i].split(",");
        var itemName = itemData[0];
        var itemQty = itemData[1];
        var itemUnit = itemData[2];
        var itemDefaultQty = itemData[1];//not used

        var listItemHTML = getListItemHTML(itemName, itemQty, itemUnit, itemDefaultQty, cartType);
        HTMLStringToBeAdded += listItemHTML;
        console.log(itemList[i]);

    }
    document.getElementById("itemList").innerHTML = HTMLStringToBeAdded;
}
function getListItemHTML(itemName, itemQty, itemUnit, itemDefaultQty, cartType) {
    var listItem = "<div class='listItem'><div class='itemName'>" + itemName + "</div><div class='Qty'>" + itemQty + " " + itemUnit + "</div>" + getButtons(itemName, itemQty, itemUnit, itemDefaultQty, cartType) + "</div>";
    return listItem;
}

function getButtons(itemName, itemQty, itemUnit, itemDefaultQty, cartType) {
    var open = "<div class='addRemove'>"
    var addButton = "<button onClick=addToCart('" + itemName + "','" + itemDefaultQty + "','" + itemUnit + "','" + itemDefaultQty + "','" + cartType + "')> Add</button>"
    var display = "<div class='display'>" + itemQty + "</div>";
    var removeButton = "<button onClick=removeFromCart('" + itemName + "','" + itemDefaultQty + "','" + itemUnit + "','" + itemDefaultQty + "','" + cartType + "')> Remove</button>"
    var close = "</div>";
    if (itemQty == 0) {

        return open + addButton + close;
    }
    else { //there is something to remove
        return open + addButton + display + removeButton + close;
    }
}


function addToCart(itemName, itemQty, itemUnit, itemDefaultQty, cartType) {

    //itemQty is the amount item to be added.
    // itemDefaultQty is just for object 
    if (localStorage.getItem(cartType + "cart") == '') {
        //cart not initialized
        localStorage.setItem(cartType + "cart", '{}'); // make empty
    }
    if (localStorage.getItem(cartType + "cart") == '{}') { //please don'wt put  else if
        //cart empty
        //add item directly to cart without increasing quantity
        var newItem = { itemName: itemName, quantity: itemQty, unit: itemUnit, default: itemDefaultQty };

        localStorage.setItem(cartType + "cart", '{ "items": [' + JSON.stringify(newItem) + ']}');
        addHTMLCart(itemName, itemQty, itemUnit, itemDefaultQty, cartType);
    }
    else { //cart not empty 
        oldCart = JSON.parse(localStorage.getItem(cartType + "cart"))["items"];
        //if name already in oldCart, increase quantity else add item

        var isName = false;
        for (var i = 0; i < oldCart.length; i++) {
            if (oldCart[i].itemName == itemName) {
                oldCart[i].quantity = parseInt(oldCart[i].quantity) + parseInt(itemQty);
                isName = true;

                UpdateHTMLCart(itemName, oldCart[i].quantity, itemUnit, itemDefaultQty, cartType); //oldCart[i].quantity is present to get new value of the quantity
            }
        }
        //if name not in oldCart, add item directly to cart without increasing quantity
        if (isName == false) {
            var newItem = { itemName: itemName, quantity: itemQty, unit: itemUnit, default: itemDefaultQty };
            oldCart.push(newItem);

            addHTMLCart(itemName, itemQty, itemUnit, itemDefaultQty, cartType); //
        }

        //set cart as oldcart
        localStorage.setItem(cartType + "cart", '{ "items": ' + JSON.stringify(oldCart) + '}');

    }
    //testing
    console.log(localStorage.getItem(cartType + "cart"));

}

function removeFromCart(itemName, itemQty, itemUnit, itemDefaultQty, cartType) {
    if (localStorage.getItem(cartType + "cart") == '') {
        //cart not initialized
        localStorage.setItem(cartType + "cart", '{}'); // make empty
    }
    if (localStorage.getItem(cartType + "cart") == '{}') { //please don't put  else if
        //no change cant remove from empty
    }
    else {
        oldCart = JSON.parse(localStorage.getItem(cartType + "cart"))["items"];
        //if name already in oldCart, decrease quantity else do nothing

        var isName = false;
        for (var i = 0; i < oldCart.length; i++) {
            if (oldCart[i].itemName == itemName) {
                oldCart[i].quantity = parseInt(oldCart[i].quantity) - parseInt(itemQty);
                isName = true;
                UpdateHTMLCart(itemName, oldCart[i].quantity, itemUnit, itemDefaultQty, cartType); //oldCart[i].quantity is present to get new value of the quantity
                if (oldCart[i].quantity == 0) {
                    removeHTMLCart(itemName); //remove element from the html display
                    oldCart.splice(i, 1);
                    //remove all
                }
            }
        }
        //if name not in oldCart, do nothing
        if (isName == false) {
            //pass or alert user
        }

        //set cart as oldcart
        localStorage.setItem(cartType + "cart", '{ "items": ' + JSON.stringify(oldCart) + '}');
    }
}

function addHTMLCart(itemName, itemQty, itemUnit, itemDefaultQty, cartType) {
    var prevCartHTML = document.getElementById('cart').innerHTML;

    var element = '<div class="listItem"><div class="itemName">' + itemName + '</div><div class="Qty">' + itemQty + ' ' + itemUnit + '</div>' + getButtons(itemName, itemQty, itemUnit, itemDefaultQty, cartType) + '</div></div>';
    prevCartHTML += element;
    console.log("Added " + itemName + " to html")
    document.getElementById('cart').innerHTML = prevCartHTML;

}

function removeHTMLCart(itemName, cartType) {
    // Find the parent container element
    var cartElement = document.getElementById('cart');

    // Find all the listItem elements within the parent container
    var listItems = cartElement.getElementsByClassName('listItem');

    // Iterate through the listItems
    for (var i = 0; i < listItems.length; i++) {
        var listItem = listItems[i];

        // Find the itemName element within the listItem
        var itemNameElement = listItem.querySelector('.itemName');

        // Check if the itemName matches 'Carrot'
        if (itemNameElement.textContent === itemName) {
            // Remove the listItem element
            listItem.remove();
            break; // Exit the loop after removing the first occurrence of 'Carrot'
        }
    }


}

function UpdateHTMLCart(itemName, itemQty, itemUnit, itemDefaultQty, cartType) {
    //add or subtract or whatever. just replace the html by what is provided in itemQty
    var prevCartHTML = document.getElementById('cart').innerHTML;
    //search in prevCartHTMl for itemname and replace its elements
    var element = '<div class="itemName">' + itemName + '</div><div class="Qty">' + itemQty + ' ' + itemUnit + '</div>'; //not to alter button or itemDefaultQty
    var exp = /\d+/;
    var itemNameRegex = new RegExp('<div class="itemName">' + itemName + '</div><div class="Qty">' + exp.source + " " + itemUnit + "+</div>");
    //remove everything between index start and end (remove the old quantity element and name element)
    var updatedHTML = prevCartHTML.replace(itemNameRegex, element);

    //console.log(updatedHTML)

    document.getElementById('cart').innerHTML = updatedHTML;


}

function loadCartHTML(cartType) {
    //for every element in local storage add the html element
    var cart = JSON.parse(localStorage.getItem(cartType + "cart"))["items"];
    for (var i = 0; i < cart.length; i++) {
        addHTMLCart(cart[i].itemName, cart[i].quantity, cart[i].unit, cart[i].itemDefaultQty, cart[i].quantity, cartType);
    }
}

function loadItemArray(cartType) {
    filename = cartType + ".txt";

    //fetch items from text file and add to a list
    var request = new XMLHttpRequest();
    request.open('GET', filename, false);
    request.send();

    if (request.status >= 200 && request.status < 400) {

        var itemList = request.responseText.split("\n");
        console.log(itemList);
        return itemList;

    } else {
        console.error("Error fetching file of :" + cartType, request.statusText);
        return null;
    }
}