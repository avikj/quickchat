Router.route('/', function () {
  var id = Chats.insert({
    messages: [],
  });
  Router.go('/chat/'+id);
});
Router.route('/chat/:_id', {
  name: 'chat',
  template: 'chat',
  data: function(){
    return Chats.findOne({_id: this.params._id});
  },
  onData: function(){
    var cursor = Chats.findOne({_id: Router.current().data()._id});
    console.log("yay");
    console.log(cursor);
  }
});
if (Meteor.isClient) {
  Template.chat.events({
    "submit #new-message":function(event){
      event.preventDefault();
      var msg = event.target.input.value;
      Chats.update({_id: this._id}, { $push: { messages: {sender:Session.get("username"), message: msg}} });
      event.target.input.value="";
    },
    "submit #username-form":function(event){
      event.preventDefault();
      Session.set("username", event.target.input.value);
    }
  });
  Template.chat.helpers({
    "username":function(){
      return Session.get("username");
    },
    "iSent":function(sender){
      return Session.get("username")===sender;
    },
    "sharingLink":function(){
      return "quickchat.meteor.com/chat/"+this._id;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.methods({
    log:function(text){
      console.log(text);
    }
  });
}
Chats = new Mongo.Collection("chats");
