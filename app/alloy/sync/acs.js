function S4() {
return ((1 + Math.random()) * 65536 |
0).toString(16).substring(1);
}
function guid() {
return S4() + S4() + "-" + S4() + "-"
+ S4() + "-" + S4() + "-" + S4() + S4() + S4();
}
function InitAdapter(config) {
Cloud = require("ti.cloud");
Cloud.debug = !0;
config.Cloud = Cloud;
}
function Sync(model, method, opts) {
// Will be filled in later!!

}
var _ = require("alloy/underscore")._;
module.exports.sync = Sync;
module.exports.beforeModelCreate = function(config) {
config = config || {};
config.data = {};
InitAdapter(config);
return config;
};
module.exports.afterModelCreate = function(Model) {
Model = Model || {};
Model.prototype.config.Model = Model;
return Model;
};
case "read":
model.id && (opts.data.photo_id = model.id);
var method = model.id ? Cloud.Photos.show : Cloud.Photos.query;
method((opts.data || {}), function(e) {
if (e.success) {
model.meta = e.meta;
if (e.photos.length === 1) {
opts.success(e.photos[0]);
} else {
opts.success(e.photos)
}
model.trigger("fetch");
return;
} else {
Ti.API.error("Cloud.Photos.query " + e.message);
opts.error(e.error && e.message || e);
}
});
break;
