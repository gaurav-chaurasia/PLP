/*
    some genral points about application
    * there are three controller
        ui_controller,
        budget_controller,
        and controller => which linkes both controllers

    all controller returns some function object using which we are other controller access 
    informations 
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
        }
    }; 

    return {
        // whenever someone calls this function we will add a new input to aur list
        add_item: function(type, description, value)  { 
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
        checking: function() { // just for checking data 
            console.log(data);
        }
    };

})();



var ui_controller = (function() {

    var DOM = { // an Object to store all the DOM strings for code enhancment perpose 
        input_type: '.add__type',
        input_description: '.add__description', 
        input_value: '.add__value', 
        input_btn: '.add__btn',
        income_list: '.income__list',
        expenses_list: '.expenses__list'
    };

    return {
        get_input: function() { // using this get_input method we can get requied input as an object
            
            return {
                type : document.querySelector(DOM.input_type).value, 
                description : document.querySelector(DOM.input_description).value, 
                value : document.querySelector(DOM.input_value).value
            };
            // console.log(type + ' ' + description + ' ' + value);
        },

        add_list_item: function(obj, type) {
            var html, new_html, element;

            if (type === 'inc') {
                element = DOM.income_list;

                // <div class="item clearfix" id="income-1">
                //     <div class="item__description">GSOC</div>
                //     <div class="right clearfix">
                //         <div class="item__value">+ 2400.00 $</div>
                //         <div class="item__delete">
                //             <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                //         </div>
                //     </div>
                // </div>

                html = '<div class="item clearfix" id="income-{%id%}"><div class="item__description" >{%description%}</div ><div class="right clearfix"><div class="item__value">+ {%value%} $</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';
            } else {
                element = DOM.expenses_list;


                // <div class="item clearfix" id="expense-0">
                //     <div class="item__description">Apartment rent</div>
                //     <div class="right clearfix">
                //         <div class="item__value">- 500.00</div>
                //         <div class="item__percentage">5%</div>
                //         <div class="item__delete">
                //             <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                //         </div>
                //     </div>
                // </div>

                html = '<div class="item clearfix" id="expense-{%id%}"><div class="item__description">{%description%}</div><div class="right clearfix"><div class="item__value">- {%value%}</div><div class="item__percentage">5%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            new_html = html.replace('{%id%}', obj.id);
            new_html = new_html.replace('{%description%}', obj.description);
            new_html = new_html.replace('{%value%}', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', new_html);
        },

        get_DOM: function() { // passing those DOM string to Other controller for access
            return DOM;
        }
    };

})();



var controller = (function(b_controller, u_controller) {

    var setup_event_listener = function () { // all the event listener will go here 
        var DOM = u_controller.get_DOM(); // here I got all the DOM string defined in ui_controller
        /*
        if you are getting confuse what DOM srings is then have a look on DOM object
        defined in ui_controller
        also I only need DOM thrings here so defing in this scope 
        */

        document.querySelector(DOM.input_btn).addEventListener('click', add_item);
 
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) { // only when Enter is pressed 
                add_item();
            }
        });
    };



    var add_item = function () {
        var input, new_item;
        // 1. get user data that was filled in the filled
        input = u_controller.get_input();
        // console.log(input);
        // 2. add item to budget controller
        new_item = b_controller.add_item(input.type, input.description, input.value);
        // console.log('is it working!!');
        // 3. add item to UI 
        u_controller.add_list_item(new_item, input.type);
    };

    return {
        init: function() {
            console.log('Application has started!!!');
            setup_event_listener();
        }
    }

})(budget_controller, ui_controller);

controller.init(); // this will intialize application

