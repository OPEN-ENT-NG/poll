import { http, notify } from 'entcore';

export let pollModel: any = {};
export let answerModel: any = {};

/**
 * Model to create an answer. The poll object contains a list of this object.
 */
answerModel.Answer = function() {};

pollModel.Poll = function() {};
pollModel.Poll.prototype = {

    /**
     * Allows to save the poll. If the poll is new and does not have any id set,
     * this method calls the create method otherwise it calls the update method.
     * @param callback a function to call after saving.
     */
    save: function(callback) {
        if(this._id) {
            this.update(callback);
        } else {
            this.create(callback);
        }
    },

    /**
     * Allows to create a new poll. This method calls the REST web service to
     * persist data.
     * @param callback a function to call after create.
     */
    create: function(callback) {
        http().postJson('/poll', this.toJSON()).done(function() {
            if(typeof callback === 'function'){
                callback();
            }
        });
    },

    /**
     * Allows to update the poll. This method calls the REST web service to persist
     * data.
     * @param callback a function to call after create.
     */
    update: function(callback) {
        http().putJson('/poll/' + this._id, this).done(function() {
            notify.info('poll.save.info');
            if(typeof callback === 'function'){
                callback();
            }
        });
    },

    /**
     * Allows to delete the poll. This method calls the REST web service to delete
     * data.
     * @param callback a function to call after delete.
     */
    delete: function(callback) {
        http().delete('/poll/' + this._id).done(function() {
            pollModel.polls.remove(this);
            if(typeof callback === 'function'){
                callback();
            }
        }.bind(this));
    },

    /**
     * Allows to convert the current poll into a JSON format.
     * @return the current poll in JSON format.
     */
    toJSON: function() {
        return {
            icon: this.icon,
            question: this.question,
            end: this.end,
            answers: this.answers
        }
    }
};