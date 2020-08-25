/** 
 *    some genral points about application
 *   * there are three controller
 *      ui_controller,
 *      budget_controller,
 *      and controller => which linkes both controllers
 *
 *  all controller returns some function object using which we are other controller access 
 *  informations 
 */

var budget_controller = (function () { // these are function variable defined and initializd here 
    // all the value from here are private becouse of scope chaine rule 
    // but we can return a function containing all the rquierd value for public in a object 

    var Income = function (id, description, value) { //instanse of income objecr
        this.id = id;
        this.value = value;
        this.description = description;
    };

    var Expense = function (id, description, value) { //instanse of expense objecr
        this.id = id;
        this.value = value;
        this.description = description;
    };

    var data = { // see this is a gainte object which will store every thing 
        // total INCOME and EXPENSE also the individual inc and exp
        all_items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    var calculate_total = function (type) {
        var sum = 0;
        data.all_items[type].forEach(function (current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    return {
        // whenever someone calls this function we will add a new input to aur list
        add_item: function (type, description, value) {
            var new_item, ID;
            // create new id 
            if (data.all_items[type].length > 0) {
                ID = data.all_items[type][data.all_items[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // create new item based on inc or exp
            if (type === 'inc') {
                new_item = new Income(ID, description, value);
            } else {
                new_item = new Expense(ID, description, value);
            }

            // pushing newly created element to the list 
            data.all_items[type].push(new_item);
            return new_item;
        },

        calculate_budget: function () {
            calculate_total('exp');
            calculate_total('inc');

            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else
                data.percentage = -1;
        },

        delete_item: function (type, id) {
            /**
             * this delete_item method 
             * @map returns all ids availble and stores in ids 
             * now with @indexOf method we look for element with value is -> @id 
             * and store it in @index var 
             * 
             * @splice is a method to delete elements from array 
             */
            var ids, index;

            ids = data.all_items[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.all_items[type].splice(index, 1);
            }
        },

        get_budget: function () {
            return { // returns object
                budget: data.budget,
                total_inc: data.totals.inc,
                total_exp: data.totals.exp,
                percentage: data.percentage
            }
        },

        checking: function () { // just for checking data 
            console.log(data);
        }
    };

})();



var ui_controller = (function () {

    var DOM = { // an Object to store all the DOM strings for code enhancment perpose 
        input_type: '.add__type',
        input_description: '.add__description',
        input_value: '.add__value',
        input_btn: '.add__btn',
        income_list: '.income__list',
        expenses_list: '.expenses__list',
        budget_label: '.budget__value',
        inc_label: '.budget__income--value',
        exp_label: '.budget__expenses--value',
        percentage_label: '.budget__expenses--percentage',
        container: '.container'
    };

    return {
        get_input: function () { // using this get_input method we can get requied input as an object

            return {
                type: document.querySelector(DOM.input_type).value,
                description: document.querySelector(DOM.input_description).value,
                value: parseFloat(document.querySelector(DOM.input_value).value)
            };
            // console.log(type + ' ' + description + ' ' + value);
        },

        add_list_item: function (obj, type) {
            var html, new_html, element;

            if (type === 'inc') {
                element = DOM.income_list;

                // <div class="item clearfix" id="inc-1">
                //     <div class="item__description">GSOC</div>
                //     <div class="right clearfix">
                //         <div class="item__value">+ 2400.00 $</div>
                //         <div class="item__delete">
                //             <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                //         </div>
                //     </div>
                // </div>

                html = '<div class="item clearfix" id="inc-{%id%}"><div class="item__description" >{%description%}</div ><div class="right clearfix"><div class="item__value">+ {%value%} $</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';
            } else {
                element = DOM.expenses_list;


                // <div class="item clearfix" id="exp-0">
                //     <div class="item__description">Apartment rent</div>
                //     <div class="right clearfix">
                //         <div class="item__value">- 500.00</div>
                //         <div class="item__percentage">5%</div>
                //         <div class="item__delete">
                //             <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                //         </div>
                //     </div>
                // </div>

                html = '<div class="item clearfix" id="exp-{%id%}"><div class="item__description">{%description%}</div><div class="right clearfix"><div class="item__value">- {%value%}</div><div class="item__percentage">5%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            new_html = html.replace('{%id%}', obj.id);
            new_html = new_html.replace('{%description%}', obj.description);
            new_html = new_html.replace('{%value%}', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', new_html);
        },

        delete_list_item: function (selector_id) {
            var el = document.getElementById(selector_id);
            el.parentNode.removeChild(el);
        },

        /**
         * this clear field fun is to clear input field after adding any item
         */
        clear_fields: function () {
            var fields, fields_array;

            fields = document.querySelectorAll(DOM.input_description + ', ' + DOM.input_value);

            /**
             * @fiels var is a list as querySelectorAll return but 
             * we don't get all those fun with list
             * that we could get with array so, lets make list to array for that
             * @Array -> @protype -> @slice // as slice method returns arr 
             */
            fields_array = Array.prototype.slice.call(fields);
            fields_array.forEach(function (current, index, arr) {
                current.value = "";
            });
            fields_array[0].focus();
            // console.log(fields)  //just for debuging 
            // console.log(fields_array);
        },

        display_budget: function (obj) { // obj contains all requied data
            document.querySelector(DOM.budget_label).textContent = obj.budget;
            document.querySelector(DOM.inc_label).textContent = obj.total_inc;
            document.querySelector(DOM.exp_label).textContent = obj.total_exp;

            if (obj.percentage > 0)
                document.querySelector(DOM.percentage_label).textContent = obj.percentage + '%';
            else
                document.querySelector(DOM.percentage_label).textContent = '---';
        },

        get_DOM: function () { // passing those DOM string to Other controller for access
            return DOM;
        }
    };

})();



var controller = (function (b_controller, u_controller) {

    var setup_event_listener = function () { // all the event listener will go here 
        var DOM = u_controller.get_DOM(); // here I got all the DOM string defined in ui_controller
        /**
         * if you are getting confuse what DOM srings is then have a look on DOM object
         * defined in ui_controller
         * also I only need DOM thrings here so defing in this scope 
         */

        document.querySelector(DOM.input_btn).addEventListener('click', add_item);

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) { // only when Enter is pressed 
                add_item();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', control_delete_item);

    };

    var update_budget = function () {
        b_controller.calculate_budget();

        var budget = b_controller.get_budget();
        // console.log(budget);
        u_controller.display_budget(budget);
    };


    var add_item = function () {
        var input, new_item;
        // 1. get user data that was filled in the filled
        input = u_controller.get_input();
        // console.log(input);
        // 2. add item to budget controller
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) { // if input fields are not empty then only add it ui
            new_item = b_controller.add_item(input.type, input.description, input.value);
            // console.log('is it working!!');
            // 3. add item to UI 
            u_controller.add_list_item(new_item, input.type);

            u_controller.clear_fields();
            update_budget();
        }
    };

    var control_delete_item = function (event) {
        var item_id, split_id, type, ID;
        item_id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (item_id) {
            split_id = item_id.split('-');
            type = split_id[0];
            ID = parseInt(split_id[1]);

            b_controller.delete_item(type, ID);
            u_controller.delete_list_item(item_id);

            update_budget();
        }
    };

    return {
        init: function () {
            console.log('Application has started!!!');
            u_controller.display_budget({ // initiallizing every thing to ZERO
                budget: 0,
                total_inc: 0,
                total_exp: 0,
                percentage: -1
            });
            setup_event_listener();
        }
    }

})(budget_controller, ui_controller);

controller.init(); // this will intialize application

