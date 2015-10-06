/**
 * Created by aj on 10/2/15. This library uses HTML5 to provide an interactive credit card input experience.
 * It works with existing forms with minimal modification. This library requires jQuery for cross-browser support.
 */

ajcc = {};


ajcc.strings = {valid_thru: "Valid Thru",
                exp_format_month: "MM",
                exp_format_year: "YY",
                exp_format_separator: "/",
                cvc_message: "Please enter the last three digits on the back of your card."};


ajcc.browserIsCompatible = function () {
    //Here we test to see if the browser supports CSS animations. If it does, we assume it also supports all the
    //other CSS and JS features we need.
    var elm = document.createElement('div');
    var supported = elm.style.animationName !== undefined;

    if (!supported)
        supported = elm.style.webkitAnimationName !== undefined; //Try with webkit prefix for older webkit browsers.

    return supported;
};


ajcc._getDefaultCardVendor = function (iconUrl) {

    var validator = function (number) {
        return true;
    };

    var formatter = function (number) {
        return number;
    };

    return new ajcc.CardVendor('default', validator, formatter, [], iconUrl, 'back');
};


ajcc.getVisaCardVendor = function (iconUrl) {

    var validator = function (number) {
        return number.substring(0,1) === "4";
    };

    var formatter = function (number) {

        var result = "";

        for (var i = 0, len = number.length; i < len; i++) {

            if (i > 0 && i % 4 == 0)
                result += " ";

            result += number[i];
        }

        return result;
    };

    return new ajcc.CardVendor('visa', validator, formatter, ['visa'], iconUrl, 'back');
};


ajcc.getMasterCardCardVendor = function (iconUrl) {

    var validator = function (number) {
        return number.substring(0,1) === "5" && (parseInt(number.substring(1,2)) >= 1 && parseInt(number.substring(1,2)) <= 5);
    };

    var formatter = function (number) {

        var result = "";

        for (var i = 0, len = number.length; i < len; i++) {

            if (i > 0 && i % 4 == 0)
                result += " ";

            result += number[i];
        }

        return result;
    };

    return new ajcc.CardVendor('mastercard', validator, formatter, ['master-card'], iconUrl, 'back');
};


ajcc.getAmexCardVendor = function (iconUrl) {

    var validator = function (number) {
        return number.substring(0,1) === "3" && (number.substring(1,2) === "4" || number.substring(1,2) === "7");
    };

    var formatter = function (number) {

        var result = "";

        for (var i = 0, len = number.length; i < len; i++) {

            if (i == 4 || i == 10)
                result += " ";

            result += number[i];
        }

        return result;
    };

    return new ajcc.CardVendor('amex', validator, formatter, ['amex'], iconUrl, 'front');
};


ajcc.CardVendor = function(name, validator, formatter, classes, iconURL, cvcLocation) {

    this.name = name;
    this.validator = validator;
    this.formatter = formatter;
    this.classes = classes || [];
    this.iconURL = iconURL;
    this.cvcLocation = cvcLocation; //Possible choices are null, 'front', and 'back'.
};


ajcc.Card = function (container, numberInput, nameInput, monthInput, yearInput, cvcInput, vendors, chipIconURL, defaultIconURL) {

    this.cardDomObject = $("<div class='card-container'> \
		<div class='flipper'> \
			<div class='card' data-card-face='front'> \
				<img class='emv-chip' src=''> \
				<img class='issuer-logo' src=''> \
				<div class='security-code'>827</div> \
				<p class='valid-thru'></p> \
				<div class='text card-number'></div> \
				<div class='text exp-date'></div> \
				<div class='text cardholder-name'></div> \
			</div> \
			<div class='card back' data-card-face='back'> \
				<div class='magnetic-stripe'></div> \
				<div class='signature-pad'></div> \
				<div class='security-code-container'> \
					<div class='security-code'>827</div> \
				</div> \
				<div class='debossed-container'> \
					<div class='text card-number'></div> \
					<div class='text exp-date'></div> \
					<div class='text cardholder-name'></div> \
				</div> \
			</div> \
		</div> \
	</div>");

    this.cardDomObject.find(".emv-chip").attr("src", chipIconURL);
    this.cardDomObject.find(".valid-thru").text(ajcc.strings.valid_thru);
    this.cardDomObject.find(".signature-pad").text(ajcc.strings.cvc_message);

    this.container = container;
    this.numberInput = numberInput;
    this.nameInput = nameInput;
    this.monthInput = monthInput;
    this.yearInput = yearInput;
    this.cvcInput = cvcInput;
    this.allInputs = numberInput.add(nameInput).add(monthInput).add(yearInput).add(cvcInput);

    this.numberText = this.cardDomObject.find(".card-number");
    this.nameText = this.cardDomObject.find('.cardholder-name');
    this.expText = this.cardDomObject.find('.exp-date').text(ajcc.strings.exp_format_month + ajcc.strings.exp_format_separator + ajcc.strings.exp_format_year);
    this.cvcText = this.cardDomObject.find('.security-code');
    this.frontFace = this.cardDomObject.find("[data-card-face='front']");
    this.backFace = this.cardDomObject.find("[data-card-face='back']");
    this.frontCvcText = this.frontFace.find(".security-code");
    this.backCvcText = this.backFace.find(".security-code");
    this.vendorIcon = this.cardDomObject.find(".issuer-logo");

    vendors.push(ajcc._getDefaultCardVendor(defaultIconURL));

    this.vendors = vendors;
    this.currentVendor = vendors[vendors.length - 1];

    this.sanitizeNumberString = function (number) {

        var result = "";
        var digits = "0123456789";

        for (var i = 0, len = number.length; i < len; i++) {

            if (digits.indexOf(number[i]) > -1)
                result += number[i];
        }

        return result;
    };

    this.sanitizeMonthString = function (month) {
        return month.length === 1 ? "0" + month : month;
    };

    this.sanitizeYearString = function (year) {
        return year.substring(year.length - 2);
    };

    this.flip = function () {

        this.frontFace.toggleClass('flip');
        this.backFace.toggleClass('flip');
    };

    this.highlight = function (domObject) {
        domObject.toggleClass('glow');
    };

    this.redraw = function () {

        if (!ajcc.browserIsCompatible())
            return;

        //First we need to choose a vendor. We're guaranteed to find the default vendor if none other match.
        var vendor = null;
        var sanitizedNumber = this.sanitizeNumberString(this.numberInput.val());

        for (var i = 0, len = this.vendors.length; i < len; i++) {

            if (this.vendors[i].validator(sanitizedNumber)) {
                vendor = this.vendors[i];
                break;
            }
        }

        //Let's update the card so that it reflects the vendor.
        this.frontFace.removeClass(this.currentVendor.classes.join(" ")).addClass('card').addClass(vendor.classes.join(" "));
        this.vendorIcon.attr("src", vendor.iconURL);

        //See what to do about the CVC text.
        this.frontCvcText.hide();
        this.backCvcText.hide();

        if (vendor.cvcLocation == "front") {
            this.frontCvcText.show();
        } else if (vendor.cvcLocation == "back") {
            this.backCvcText.show();
        }

        //Finally, update all the fields.
        this.numberText.text(vendor.formatter(this.sanitizeNumberString(this.numberInput.val())));
        this.nameText.text(this.nameInput.val());
        this.expText.text(this.sanitizeMonthString(this.monthInput.val()) + ajcc.strings.exp_format_separator + this.sanitizeYearString(this.yearInput.val()));
        this.cvcText.text(this.cvcInput.val());

        this.currentVendor = vendor;
    };

    this.redraw();

    if (ajcc.browserIsCompatible())
        container.append(this.cardDomObject);

    /* Events */
    var card = this;
    this.allInputs.on("keyup change", function () {
       card.redraw();
    });

    this.numberInput.on("focus blur", function () {
        card.highlight(card.numberText);
    });

    this.nameInput.on("focus blur", function () {
        card.highlight(card.nameText);
    });

    this.monthInput.on("focus blur", function () {
        card.highlight(card.expText);
    });

    this.yearInput.on("focus blur", function () {
        card.highlight(card.expText);
    });

    this.cvcInput.on("focus blur", function () {
       if (card.currentVendor.cvcLocation == "back")
            card.flip();

        card.highlight(card.cvcText);
    });

    this.numberText.on("click", function () {
       card.numberInput.focus();
    });

    this.nameText.on("click", function () {
       card.nameInput.focus();
    });

    this.expText.on("click", function () {
       card.monthInput.focus();
    });

    this.cvcText.on("click", function () {
       card.cvcInput.focus();
    });
};
