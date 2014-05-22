(function () {
    'use strict';

    _.extend(Backbone.Collection, Backbone.Events);
    _.extend(Backbone.View, Backbone.Events);

    Backbone.Collection.prototype.remove = _.wrap(Backbone.Collection.prototype.remove, function (fn) {
        this.trigger('remove');
        fn.call(this);
    });

    Backbone.View.prototype.remove = _.wrap(Backbone.View.prototype.remove, function (fn) {
        this.trigger('remove');
        fn.call(this);
    });

    // ------------------------------

    var TestModel = Backbone.Model.extend({
        defaults: {
            foo: 'bar'
        }
    });

    var m = new TestModel();

    m.on('all', function (event) {
        console.log('=> on model:', this, 'do action: ' + event);
    });

    m.destroy();


    // ------------------------------


    var TestCollection = Backbone.Collection.extend({

    });

    var c = new TestCollection();

    c.on('all', function (event) {
        console.log('=> on collection:', this, 'do action: ' + event);
    });

    c.remove();


    // ------------------------------


    var TestView = Backbone.View.extend({
        tagName: 'div'
    });

    var v = new TestView();

    v.on('all', function (event) {
        console.log('=> on view:', this, 'do action: ' + event);
    });

    v.remove();

}());