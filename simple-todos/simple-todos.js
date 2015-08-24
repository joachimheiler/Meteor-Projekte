Tasks = new Mongo.Collection("tasks");

if (!Meteor.isClient) {
} else {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });


  Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var text = event.target.text.value;

      // Insert a task into the collection
      Tasks.insert({
        text: text,
        createdAt: new Date(),            // current time
        changedAt: new Date(0),
        owner: Meteor.userId(),           // _id of logged in user
        username: Meteor.user().username  // username of logged in user
      });

      // Clear form
      event.target.text.value = "";

    },

    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }

  });

  Template.task.events({
    "click .toggle-checked": function ()
    {
      // Set the checked property to the opposite of its current value
      Tasks.update(this._id, {
        $set: {checked: !this.checked},
        $set: {changedAt: new Date() }
      });
    },

    "click .delete": function () {
      Tasks.remove(this._id);
    }
  });


  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });


  /* fullcalendar */
/*
  Template.fullcalendar.rendered = function() {
    var div = this.$(this.firstNode);
    //jquery takes care of undefined values, no need to check here
    div.attr('id',this.data.id);
    div.addClass(this.data.class);
    div.fullCalendar(this.data);
  };
*/

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
