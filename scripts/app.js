/*global _, $, Backbone */

$(function () {
    'use strict';

    Backbone.Collection.prototype.destroy = function () {
        var self = this;
        this.sync('delete', this, {
            success: function (msg) {
                console.log(self.constructor.name, ': delete (Success)', msg);
            },
            error: function (msg) {
                console.log(self.constructor.name, ': delete (Error)', msg);
            }
        });
    };

    // ------------------------------

    var Model = Backbone.Model.extend({
        defaults: {
            title: 'none'
        },

        constructor: function Model() {
            Backbone.Model.apply(this, arguments);
        }
    });

    // ------------------------------

    var Collection = Backbone.Collection.extend({
        model: Model,
        localStorage: new Backbone.SessionStorage('test-backbone-debugger'),

        constructor: function Collection() {
            Backbone.Collection.apply(this, arguments);
        }
    });

    // ------------------------------

    var Widget = Backbone.View.extend({
        tagName: 'li',

        constructor: function Widget() {
            Backbone.View.apply(this, arguments);

            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);

            this.model.save();
        },

        render: function () {
            this.$el.text(this.model.get('title'));
            return this;
        }
    });

    // ------------------------------

    var View = Backbone.View.extend({
        el: '#app',

        constructor: function View() {
            Backbone.View.apply(this, arguments);

            var self = this;
            this.collection = new Collection();
            this.listenTo(this.collection, 'add', this.add);

            this.collection.sync('create', this.collection, {
                success: function (msg) {
                    console.log(self.constructor.name + ': create (Success)', msg);
                },
                error: function (msg) {
                    console.log(self.constructor.name + ': create (Error)', msg);
                }
            });
        },

        add: function (widget) {
            console.log('View#add', widget);

            var o = new Widget({
                model: widget
            });

            var $ul = this.$el.find('ul');

            $ul.append(o.render().$el);
        },

        render: function () {
            console.log('View#render');
            this.$el.html($('<ul>'));
        }
    });

    var v = new View();
    v.render();

    v.collection.add(new Model({ title: 'cookie' }));
    v.collection.add(new Model({ title: 'dog' }));
    v.collection.add(new Model());
    v.collection.add(new Model());
    v.collection.add(new Model({ title: 'computer' }));

    // Bad solution
    // _.invoke(v.collection.models, 'destroy')

    // Weak solution, because remove only view related with models (don't delete model instance)
    // _.invoke(v.collection.models, 'trigger', 'destroy');

    // The best solution to delete models and views related with it
    var model = v.collection.first();
    while (model) {
        model.destroy();
        model = v.collection.first();
    }

    // Custom method extended Backbone.Collection which delete with `sync` method.
    v.collection.destroy();

});