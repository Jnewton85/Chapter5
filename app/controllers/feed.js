var args = arguments[0] || {};



OS_IOS && $.cameraButton.addEventListener("click", function(_event) {
	$.cameraButtonClicked(_event);
});
// handlers
$.cameraButtonClicked = function(_event) {
	alert("user clicked camera button");
	processImage(event.media, function(processResponse) {
if (processResponse.success) {
// create the row
var rowController = Alloy.createController("feedRow",
processResponse.model);
// add the controller view, which is a row to the table
if ($.feedTable.getData().length === 0) {
$.feedTable.setData([]);
$.feedTable.appendRow(rowController.getView(), true);
} else {
	$.feedTable.insertRowBefore(0, rowController.getView(),
true);
}
} else {
alert("Error saving photo " + processResponse.message);
}
});
};


var photoSource = Titanium.Media.getIsCameraSupported() ? Titanium.Media.showCamera : Titanium.Media.openPhotoGallery;
photoSource({
	success : function(event) {
		processImage(event.media, function(_photoResp) {
			photoObject = _photoResp;
			// create the row
			var row = Alloy.createController("feedRow", photoResp);
			// add the controller view, which is a row to the table
			if ($.feedTable.getData().length === 0) {
				$.feedTable.setData([]);
				$.feedTable.appendRow(row.getView(), true);
			} else {
				$.feedTable.insertRowBefore(0, row.getView(), true);
			}

		});
	},
	cancel : function() {
		// called when user cancels taking a picture
	},
	error : function(error) {
		// display alert on error
		if (error.code == Titanium.Media.NO_CAMERA) {
			alert('Please run this test on device');
		} else {
			alert('Unexpected error: ' + error.code);
		}
	},
	saveToPhotoGallery : false,
	allowEditing : true,
	// only allow for photos, no video
	mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
});

function processImage(_mediaObject, _callback) {
	// since there is no ACS integration yet, we will fake it
	var photoObject = {
		image : _mediaObject,
		title : "Sample Photo " + new Date()
	};
		var parameters = {
"photo" : _mediaObject,
"title" : "Sample Photo " + new Date(),
"photo_sizes[preview]" : "200x200#",
"photo_sizes[iphone]" : "320x320#",
// We need this since we are showing the image immediately
"photo_sync_sizes[]" : "preview"
};
var photo = Alloy.createModel('Photo', parameters);
photo.save({}, {
success : function(_model, _response) { debugger;
Ti.API.info('success: ' + _model.toJSON());
_callback({
model : _model,
message : null,
success : true
});
},
error : function(e) { debugger;
Ti.API.error('error: ' + e.message);
_callback({
model : parameters,
message : e.message,
success : false
});
}
});

	// return the object to the caller
	_callback(photoObject);
	
}

$.initialize = function(){
loadPhotos();
};
// Add the above code for the function initialize to feed.js
function loadPhotos() {
var rows = [];
// creates or gets the global instance of photo collection
var photos = Alloy.Collections.photo ||
Alloy.Collections.instance("Photo");
// be sure we ignore profile photos;
var where = {
title : {
"$exists" : true
}
};
photos.fetch({
data : {
order : '-created_at',
where : where
},
success : function(model, response) {
photos.each(function(photo) {
var photoRow = Alloy.createController("feedRow",
photo);
rows.push(photoRow.getView());
});
$.feedTable.data = rows;
Ti.API.info(JSON.stringify(data));
},
error : function(error) {
alert('Error loading Feed ' + e.message);
Ti.API.error(JSON.stringify(error));
}
});
}
