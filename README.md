## What is ajcc?

An easy to use, open-source (MIT license) library that provides interactive credit card input when making a purchase online. It is compatible with all modern browsers, is localizable, is based on pure CSS, and can be bolted on to most existing html forms in seconds. It currently supports VISA, MasterCard, and American Express out of the box, but it provides an easy way to extend the credit cards supported with a few lines of code.

If you like the library and have time, consider contributing to it! This library was made to improve the user checkout experience at [Robert McNeel & Associates](https://rhino3d.com).

## Live demo
View a live demo [here](https://rawgit.com/andresjacobo/ajcc/master/demo.html)!

## Requirements for using this library

### Web browser requirements:
ajcc uses the latest CSS standards, and requires at least the following web browsers:

1. Safari 5 or later.
2. IE 10 or later.
3. A recent version of Chrome, Firefox, or Opera.
4. Other browsers adhering to the latest standards should also work.

If the browser is not supported, ajcc will automatically hide the credit card so it does not confuse the user. Also note that some of the latest browsers support even fancier CSS that will be automatically used to render a more realistic credit card.

### Dependencies:
This library requires [jQuery](http://jquery.com) to work. Just about any recent (1.5+, 2.0+) version will do.

##Getting started
Follow the steps below and start clustering away in minutes!

- **Get the source code and images.** Get the ``ajcc.js`` JavaScript file, the ``ajcc.css`` CSS file, and the default images for the credit card networks and the emv chip (``visa.png``, ``mastercard.png``, ``amex.png``, and ``chip.png``). Put them somewhere convenient on your web server.

- **Load the ajcc.js and ajcc.css in your page.** 

#######
	<link href="/path/to/ajcc.css" rel="stylesheet" title="CSS" type="text/css"/>
	<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
	<script src="/path/to/ajcc.js"></script>

- **Create a new Card instance.** To do so, we pass it a few jQuery objects: a container (such as a div tag) where the card will be displayed, and the input fields for the credit card in your form (you will need a field for the month and another field for the year). In addition, we pass it the credit card vendors we want to support, the URL for the ``chip.png`` image, and an optional URL for a default icon to be displayed. ajcc has Visa, MasterCard, and American Express ``CardVendor`` objects right out of the box for convenience. The credit card will be automatically displayed if the browser is compatible. That's all there is to it!

#######
	var card = new ajcc.Card($("#card_container"),
                                 $("#cc_number"),
                                 $("#cc_name"),
                                 $("#cc_month"),
                                 $("#cc_year"),
                                 $("#cc_cvc"),
                                 [ajcc.getVisaCardVendor("/path/to/visa.png"),ajcc.getMasterCardCardVendor("/path/to/mastercard.png"),ajcc.getAmexCardVendor("/path/to/amex.png")],
        						 "/path/to/chip.png",
        					     "/path/to/default.png");
	
- **Advanced: Make the most out of ajcc.** Read the *Reference* to learn how to 
	- Create your own ``CardVendor`` objects to support additional credit card networks.
	- Get the current ``CardVendor`` for the user's credit card from the ``Card`` object.
	- Force a redraw of the ``Card`` object.
	- Check to see if the browser is compatible (so that perhaps you can display a different message when the credit card is displayed).
	- Localize the rendered credit card fields for non-English environments.
	