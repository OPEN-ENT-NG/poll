function Poll() {
    var poll = this;
}

Poll.prototype.save = function(callback){
    if(this._id) {
        this.update(callback);
    } else {
        this.create(callback);
    }
};

Poll.prototype.create = function(callback) {
    http().postJson('/poll', this).done(function(){
        if(typeof callback === 'function'){
            callback();
        }
    });
}

Poll.prototype.update = function(callback) {
    http().putJson('/poll/' + this._id, this).done(function(){
        if(typeof callback === 'function'){
            callback();
        }
    });
}

Poll.prototype.delete = function(callback) {
    http().delete('/poll/' + this._id).done(function(){
        model.polls.remove(this);
        if(typeof callback === 'function'){
            callback();
        }
    }.bind(this));
}

Poll.prototype.toJSON = function(){
    return {
        title: this.title,
        question: this.question
    }
};

model.build = function() {
    this.makeModel(Poll);
    
    this.collection(Poll, {
        sync: function(callback){
            http().get('/poll/list/all').done(function(polls){
                this.load(polls);
                if(typeof callback === 'function'){
                    callback();
                }
            }.bind(this));
        },
        behaviours: 'poll'
    });
}