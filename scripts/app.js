$(function () {
    'use strict';

    // ------------------------------

    var Model = Backbone.Model.extend({
        defaults: { title: null }
    });
    var m = window.m = new Model();

    // ------------------------------

    var Collection = Backbone.Collection.extend({
        model: Model,

        localStorage: new Backbone.SessionStorage('test-backbone-debugger')
    });
    var c = window.c = new Collection();

    // ------------------------------

    var Widget = Backbone.View.extend({
        tagName: 'li',

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);

            this.model.save({ title: 'te' });
        }
    });

    // ------------------------------

    var View = Backbone.View.extend({
        el: '#app',

        initialize: function () {
            this.listenTo(c, 'add', this.add);
        },

        add: function (i) {
            var o = window.o = new Widget({ model: i });
            this.$el.find('ul').append(o.render().$el);
        },

        render: function () {
            this.$el.html($('<ul>'));
        }
    });

    var v = window.v = new View();
    v.render();

    c.add(m);

    _.invoke(c.models, 'destroy');

});