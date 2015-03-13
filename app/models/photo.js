exports.definition = {
	config : {
		"adapter" : {
			"type" : "acs",
			"collection_name" : "photos"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			// extended functions go here
		});
		// end extend
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions go here
		});
		// end extend
		return Collection;
	},
}; 

function Sync(method, model, options) {
var object_name = model.config.adapter.collection_name;
if (object_name === "photos") {
processACSPhotos(model, method, options);
} else if (object_name === "users") {
processACSUsers(model, method, options);
}
}
/**
* this is a separate handler for when the object being processed
* is an ACS Photo
*/
function processACSPhotos(model, method, options) {
switch (method) {
case "create":
// include attributes into the params for ACS
Cloud.Photos.create(model.toJSON(), function(e) {
if (e.success) {
// save the meta data with object
model.meta = e.meta;
// return the individual photo object found
options.success(e.photos[0]);
// trigger fetch for UI updates
model.trigger("fetch");
} else {
Ti.API.error("Photos.create " + e.message);
options.error(e.error && e.message || e);
}
});
break;
case "read":
case "update":
case "delete":
// Not currently implemented, let the user know
alert("Not Implemented Yet");
break;
}
}