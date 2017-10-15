(function() {

window.App = {
	Models: {},
	Collections: {},
	Views: {}
};

window.template = function(id) {
	return _.template( $('#' + id).html() );
};

// Person Model
App.Models.Person = Backbone.Model.extend({
	defaults: {
		name: '',
		age: '',
		occupation: '',
		gender: ''
	},

	initialize: function() {
		this.on('error', function(model, error) {
			alert(error)
		})
	},

	validate: function(attr) {
		if (!attr.name) {
			return 'Please enter a name!'
		}

		if (!attr.age || Number(attr.age) <= 0) {
			return 'Please enter a valid age!'
		}

		if(!attr.occupation) {
			return 'Please enter an occupation!'
		}
	}
});

// A List of People
App.Collections.People = Backbone.Collection.extend({
	model: App.Models.Person
});


// View for all people
App.Views.People = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {
		this.collection.on('add', this.addOne, this);
	},

	render: function() {
		this.collection.each(this.addOne, this);

		return this;
	},

	addOne: function(person) {
		var personView = new App.Views.Person({ model: person });
		this.$el.append(personView.render().el);
	}
});

// The View for a Person
App.Views.Person = Backbone.View.extend({
	tagName: 'li',

	template: template('personTemplate'),

	initialize: function(){
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},

	events: {
	 'click .edit' : 'editPerson',
	 'click .delete' : 'DestroyPerson',
	 'click #saveDetails': 'updatePerson',
	 'click .close': 'close'
	},

	editPerson: function(){
		this.$el.find('#personDetail').hide()
		this.$el.find('#editDetails').show()
	},

	updatePerson: function() {
		var name = this.$el.find('#newName').val()
		var age = this.$el.find('#newAge').val()
		var occupation = this.$el.find('#newOccupation').val()
		var gender = this.$el.find('input[name=gender]:checked').val()

		this.model.set({ name, age, occupation, gender })
	},

	close: function() {
		this.$el.find('#editDetails').hide()
		this.$el.find('#personDetail').show()
	},

	DestroyPerson: function(){
		this.model.destroy();
	},


	remove: function(){
		this.$el.remove();
	},

	render: function() {
		this.$el.html( this.template(this.model.toJSON()) );
		return this;
	}
});


App.Views.AddPerson = Backbone.View.extend({
	el: '#addPerson',

	events: {
		'submit': 'submit'
	},

	submit: function(e) {
		e.preventDefault();
		var name = $(e.currentTarget).find('#name').val();
		var age = $(e.currentTarget).find('#age').val();
		var occupation = $(e.currentTarget).find('#occupation').val();
		var gender = $(e.currentTarget).find('input[name=gender]:checked').val()
		var person = new App.Models.Person({
			name,
			age: Number(age),
			occupation,
			gender
		});

		if (person.isValid()) {
			this.collection.add(person);
			$('input').val('');
		} else {
			alert('Please fill out all the fields');
		}
	}
});


var peopleCollection = new App.Collections.People([
	{
		name: 'Mohit Jain',
		age: 26
	},
	{
		name: 'Taroon Tyagi',
		age: 25,
		occupation: 'web designer'
	},
	{
		name: 'Rahul Narang',
		age: 26,
		occupation: 'Java Developer'
	}
]);
var addPersonView = new App.Views.AddPerson({ collection: peopleCollection });
peopleView = new App.Views.People({ collection: peopleCollection });
$(document.body).append(peopleView.render().el);
})();
