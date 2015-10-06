## ``CardVendor`` Class Reference
CardVendor objects represent a specific credit card network, such as Visa or MasterCard. You can create your own ``CardVendor`` to represent other credit card networks that are not supported by ajcc out of the box, or to customize existing card networks (i.e. providing two different ``CardVendor`` objects for different types of Visa cards).

### Constructor

- ``ajcc.CardVendor(name, validator, formatter, classes, iconURL, cvcLocation)``
	- ***name***: A unique name for this instance, such as 'visa' or 'amex'.
	- ***validator***: A function that takes a string of numbers without spaces (i.e. ``'429542942059385'``). It should return ``true`` if the number is represented by this CardVendor, or ``false`` otherwise. For example, a CardVendor for Visa would return ``true`` for all strings beginning with ``'4'``, and return ``false`` for everything else.
	- ***formatter***: A function that takes a string of numbers without spaces (i.e. ``'429542942059385'``). It should return a formatted version of that string with the correct formatting for the CardVendor. For instance, for Visa, the function should return ``'4295 4294 2059 385'``. Note that this function is called everytime the user types a number in the credit card number field.
	- ***classes***: CSS classes that should be applied to the credit card. This can be used to create different colored/pattern backgrounds using CSS.
	- ***iconURL***: The URL to the icon for this instance. The icon should be 150px by 112px, but it will be automatically scaled by the library.
	- ***cvcLocation***: The location of the CVC/Security Code. Possible values are ``'front'``, ``'back'``, or ``null`` if the CardVendor does not have a CVC/Security Code.


## ``Card`` Class Reference

### Constructor

- ``ajcc.Card(container, numberInput, nameInput, monthInput, yearInput, cvcInput, vendors, chipIconURL, defaultIconURL)``
	- ***container***: A jQuery object where the credit card will be rendered.
	- ***numberInput***: A jQuery object where the credit card number is typed.
	- ***nameInput***: A jQuery object where the cardholder's name is typed.	- ***monthInput***: A jQuery object where the expiration month is typed/selected. The month can have leading zeros, but it's not required.
	- ***yearInput***: A jQuery object where the expiration year is typed/selected. The year can have two or for digts; it doesn't matter.	- ***cvcInput***: A jQuery object where the CVC/Security Code is typed.	- ***vendors***: An array of ``CardVendor`` objects. When a credit card number is being typed by the user, the ``Card`` object will call each ``CardVendor``'s ``validator`` function in the order of the array. The first ``CardVendor`` that returns ``true`` will be selected for rendering.
	- ***chipIconURL***: The URL of the emv chip icon.
	- ***defaultIconURL***: The URL of the default icon to be displayed when there is no ``CardVendor`` selected.

### Public Methods and Properties

- ``currentVendor`` *Returns the currently selected CardVendor. You can use this property to determine what type of credit card the user has entered.*

- ``vendors`` *Returns an array of all the vendors, in order, supported by the instance.*

- ``redraw()`` *Forces a redraw of the credit card. Normally you shouldn't need to invoke this method.*

## Utility Functions and Localization

- ``ajcc.browserIsCompatible()`` *Returns true if the browser can render a Card object; otherwise returns false.*

- ``ajcc.getVisaCardVendor(iconUrl)`` *Returns a pre-configured CardVendor object for Visa credit cards.*
	- ***iconUrl***: The URL of the icon for Visa.

- ``ajcc.getMasterCardCardVendor(iconUrl)`` *Returns a pre-configured CardVendor object for MasterCard credit cards.*
	- ***iconUrl***: The URL of the icon for MasterCard.

- ``ajcc.getAmexCardVendor(iconUrl)`` *Returns a pre-configured CardVendor object for American Express credit cards.*
	- ***iconUrl***: The URL of the icon for American Express.

- ``ajcc.strings`` *A dictionary containing all the strings that will be used to render the credit card. You can modify or replace this object with localized values depending on the user's locale.*