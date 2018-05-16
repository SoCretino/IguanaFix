var $ = require("jquery");

var product = {
	id: 0,
	description: "No data",
	minQuantity: 0,
	quantity: 0,
	pricePerUnit: 0,
	fullPrice: 0
}

var products = {
	getProducts: function() {
		$.get("https://private-70cb45-aobara.apiary-mock.com/product/list", function(response){
			products.mapProducts(response);
		});
	},
	getProductPhotos: function(id) {
		$.get("https://private-70cb45-aobara.apiary-mock.com/product/" + id + "/photos", function(response) {
			products.mapProductPhotos(response);
		});
	},
	getRelatedProducts: function() {
		$.get("https://private-70cb45-aobara.apiary-mock.com/related-product/list", function(response){
			products.mapRelated(response);
		});
	},
	mapProducts: function(data) {
		var mainProduct = "";

		product.id = data[0].id;
		product.description = data[0].description;
		product.quantity = data[0].minQuantity;
		product.minQuantity = data[0].minQuantity;
		product.pricePerUnit = centsToArs(data[0].unitPriceInCents);
		product.fullPrice = "$" + centsToArs(data[0].unitPriceInCents * product.minQuantity);

		//Get default product photos, along with the data from the API, and append them
		products.getProductPhotos(product.id);
		$(".product-price").html(product.fullPrice);
		$("#quantity-value").val(product.minQuantity);

		for (var i = 0; i < data.length; i++)
			mainProduct += "<option class='product-option' id=" + i + ">" + data[i].description + "</option>";

		$("#dropdown-frigorias").html(mainProduct);

		//Get specific data and photos of a product from the select tag
		$(".product-option").click(function() {
			var id = $(this).attr('id');

			product.id = data[id].id;
			product.description = data[id].description;
			product.quantity = data[id].minQuantity;
			product.minQuantity = data[id].minQuantity;
			product.pricePerUnit = centsToArs(data[id].unitPriceInCents);
			product.fullPrice = "$" + centsToArs(data[id].unitPriceInCents * product.minQuantity);

			products.getProductPhotos(product.id);
			$(".product-price").html(product.fullPrice);
			$("#quantity-value").val(product.minQuantity);
		})
	},
	mapProductPhotos: function(data) {
		var sidePhotos = "";

		for (var i = 0; i < 3; i++)
			sidePhotos += "<img side-photo='" + i + "' class='side-photo img-responsive' src='" + data[i].url + "'/>";

		//Default photos and side-photos
		$(".product-main-img").css("background-image", "url(" + data[0].url + ")");
		$(".product-images").html(sidePhotos);

		//Simple gallery. By clicking on a specific side-photo class, it changes the background-image of the product-main-img class using the side-photo attribute.
		$(".side-photo").click(function(){
			var id = $(this).attr('side-photo');
			$(".product-main-img").css("background-image", "url(" + data[id].url + ")");
		})

		//Sets background-image if on mobile. Note: You will need to refresh the page to get a proper view of it while resizing the window, else it will look all jammy.
		var width = window.innerWidth;
		if (width < 768) {
			$(".product").css("background-image", "url(" + data[0].url + ")");
		}
	},
	mapRelated: function(data) {
		var related = "";

		for (var i = 0; i < data.length; i++)
			related += "<div class='col-sm-4'><div class='related'><div class='related-img' style=background-image:url(" + data[i].pictureUrl + "></div><div class='related-name'>" + data[i].title + "</div><div class='related-price'><i class='fa fa-credit-card'></i> desde $" + centsToArs(data[i].fromPrice) + "</div><div class='related-desc'>" + data[i].description + "</div><div class='hire'>contratar</div></div></div>";

		$("#related-products").html(related);
	},
	incrementProductQuantity: function(quantity) {
		product.quantity = quantity + 1;
		product.fullPrice = "$" + product.pricePerUnit * product.quantity;
		$('.product-price').html(product.fullPrice);
		$('#quantity-value').val(product.quantity);
	},
	decrementProductQuantity: function(quantity, minQuantity) {
		var decrement = quantity - 1;
		if (decrement < minQuantity)
			product.quantity = minQuantity;
		else
			product.quantity = decrement;
		product.fullPrice = "$" + product.pricePerUnit * product.quantity;
		$('.product-price').html(product.fullPrice);
		$('#quantity-value').val(product.quantity);
	},
	//Checks the input of #quantity-value on its own.
	listenerProductQuantity: function(quantity, minQuantity) {
		if (quantity < minQuantity)
			product.quantity = minQuantity;
		else
			product.quantity = quantity;
		product.fullPrice = "$" + product.pricePerUnit * product.quantity;
		$('.product-price').html(product.fullPrice);
		$('#quantity-value').val(product.quantity);
	}
}

function centsToArs(num) {
	return num * 0.01;
}

$(document).ready(function(){
	products.getProducts();
	products.getRelatedProducts();

	$("#increment").click(function(){
		products.incrementProductQuantity(product.quantity);
	});
	$("#decrement").click(function(){	
		products.decrementProductQuantity(product.quantity, product.minQuantity);
	});
	$("#quantity-value").change(function(){
		products.listenerProductQuantity($("#quantity-value").val(), product.minQuantity);
	});
	$(".nav-user").click(function(){
		$(".user-toggle").fadeToggle("fast");
	});
})