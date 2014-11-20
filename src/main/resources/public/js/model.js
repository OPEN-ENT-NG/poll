function Poll() {
    var poll = this;
}

Poll.prototype.create = function(data, callback) {
    http().postJson('/poll', data).done(function(result){
        callback(result);
    });
}

Poll.prototype.update = function(data, callback) {
    http().putJson('/poll/' + this._id, data).done(function(){
        callback();
    });
}

Poll.prototype.delete = function(callback) {
    http().delete('/poll/' + this._id).done(function(){
        model.polls.remove(this);
        callback();
    }.bind(this));
}

model.build = function() {
    this.makeModel(Poll);
    this.makePermanent(Poll);
}