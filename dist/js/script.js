/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
    'use strict';

    const select = {
        templateOf: {
            menuProduct: '#template-menu-product',
        },
        containerOf: {
            menu: '#product-list',
            cart: '#cart',
        },
        all: {
            menuProducts: '#product-list > .product',
            menuProductsActive: '#product-list > .product.active',
            formInputs: 'input, select',
        },
        menuProduct: {
            clickable: '.product__header',
            form: '.product__order',
            priceElem: '.product__total-price .price',
            imageWrapper: '.product__images',
            amountWidget: '.widget-amount',
            cartButton: '[href="#add-to-cart"]',
        },
        widgets: {
            amount: {
                input: 'input[name="amount"]',
                linkDecrease: 'a[href="#less"]',
                linkIncrease: 'a[href="#more"]',
            },
        },
    };

    const classNames = {
        menuProduct: {
            wrapperActive: 'active',
            imageVisible: 'active',
        },
    };

    const settings = {
        amountWidget: {
            defaultValue: 1,
            defaultMin: 1,
            defaultMax: 9,
        }
    };

    const templates = {
        menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    };

    class Product {

        constructor(id, data) {
            const thisProduct = this;
            thisProduct.id = id;
            thisProduct.data = data;
            thisProduct.renderInMenu();
            thisProduct.getElements();
            thisProduct.initAccordion();
            thisProduct.initOrderForm();
            thisProduct.processOrder;

            console.log('new Product', thisProduct);
        }

        initAccordion() {
            const thisProduct = this;

            /* find the clickable trigger (the element that should react to clicking) */

            const clickableTrigger = document.getElementById('.product__header');

            /* START: click event listener to trigger */

            thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

            /* prevent default action for event */

            event.preventDefault;

            /* toggle active class on element of thisProduct */

            //

            /* find all active products */

            const activeProducts = document.querySelectorAll('active');

            /* START LOOP: for each active product */

            for (let activeProduct of activeProducts) {

                /* START: if the active product isn't the element of thisProduct */

                if (activeProduct != thisProduct) { //nie wiem czy dobry warunek w if'ie

                    /* remove class active for the active product */

                    activeProduct.classList.remove('active');


                    /* END: if the active product isn't the element of thisProduct */
                }

                /* END LOOP: for each active product */
            }

            /* END: click event listener to trigger */

        }

        initOrderForm() {
            const thisProduct = this;
            console.log('abcd');

            thisProduct.form.addEventListener('submit', function (event) {
                event.preventDefault();
                thisProduct.processOrder();
            });

            for (let input of thisProduct.formInputs) {
                input.addEventListener('change', function () {
                    thisProduct.processOrder();
                });
            }

            thisProduct.cartButton.addEventListener('click', function (event) {
                event.preventDefault();
                thisProduct.processOrder();
            });
            console.log('abcd');
        }

        processOrder() {
            const thisProduct = this;

            /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */

            const formData = utils.serializeFormToObject(thisProduct.form);
            console.log('formData', formData);

            /* set variable price to equal thisProduct.data.price */

            let price = thisProduct.data.price;

            /* START LOOP: for each paramId in thisProduct.data.params */

            for (let paramId in thisProduct.data.params) {

                /* save the element in thisProduct.data.params with key paramId as const param */

                // const param.getElementById(paramId);
                const param = thisProduct.data.params.getElementById(paramId);

                /* START LOOP: for each optionId in param.options */

                for (let optionId in param.options) {

                    /* save the element in param.options with key optionId as const option */

                    const option = param.options.getElementById(optionId);
                    const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
                    /* START IF: if option is selected and option is not default */
                    if (optionSelected && !option.default) {

                        /* add price of option to variable price */

                        price = price + option.price;


                    }
                    /* END LOOP: for each optionId in param.options */
                }
                /* END LOOP: for each paramId in thisProduct.data.params */
            }
            /* set the contents of thisProduct.priceElem to be the value of variable price */

        }

        renderInMenu() {
            const thisProduct = this;

            /* generate HTML based on template */

            const generatedHTML = templates.menuProduct(thisProduct.data);

            /* create element using utils.createElementFromHTML */

            thisProduct.element = utils.createDOMFromHTML(generatedHTML);

            /* find menu container */

            const menuContainer = document.querySelector(select.containerOf.menu);

            /* add element to menu */

            menuContainer.appendChild(thisProduct.element);
        }

        getElements() {
            const thisProduct = this;

            thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
            thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
            thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
            thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
            thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
            thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);

        }
    }
    const app = {

        initData: function () {
            const thisApp = this;

            thisApp.data = dataSource;
        },

        initMenu: function () {
            const thisApp = this;

            console.log('thisApp.data', thisApp.data);

            for (let productData in thisApp.data.products) {
                new Product(productData, thisApp.data.products[productData]);
            }
        },

        init: function () {
            const thisApp = this;
            thisApp.initData();
            thisApp.initMenu();
            console.log('*** App starting ***');
            console.log('thisApp:', thisApp);
            console.log('classNames:', classNames);
            console.log('settings:', settings);
            console.log('templates:', templates);

            thisApp.initMenu();
        },
    };

    app.init();
}
