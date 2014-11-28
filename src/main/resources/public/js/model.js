
/**
 * Model to create an answer. The poll object contains a list of this object.
 */
function Answer() {}

/**
 * Model to create a poll.
 */
function Poll() {}

/**
 * Allows to save the poll. If the poll is new and does not have any id set,
 * this method calls the create method otherwise it calls the update method.
 * @param callback a function to call after saving.
 */
Poll.prototype.save = function(callback) {
    if(this._id) {
        this.update(callback);
    } else {
        this.create(callback);
    }
};

/**
 * Allows to create a new poll. This method calls the REST web service to
 * persist data.
 * @param callback a function to call after create.
 */
Poll.prototype.create = function(callback) {
    http().postJson('/poll', this).done(function() {
        if(typeof callback === 'function'){
            callback();
        }
    });
};

/**
 * Allows to update the poll. This method calls the REST web service to persist
 * data.
 * @param callback a function to call after create.
 */
Poll.prototype.update = function(callback) {
    http().putJson('/poll/' + this._id, this).done(function() {
        if(typeof callback === 'function'){
            callback();
        }
    });
};

/**
 * Allows to delete the poll. This method calls the REST web service to delete
 * data.
 * @param callback a function to call after delete.
 */
Poll.prototype.delete = function(callback) {
    http().delete('/poll/' + this._id).done(function() {
        model.polls.remove(this);
        if(typeof callback === 'function'){
            callback();
        }
    }.bind(this));
};

/**
 * Allows to convert the current poll into a JSON format.
 * @return the current poll in JSON format.
 */
Poll.prototype.toJSON = function() {
    return {
        icon: this.icon,
        title: this.title,
        question: this.question,
        end: this.end,
        answers: this.answers
    }
};

/**
 * Allows to create a model and load the list of polls from the backend.
 */
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
};