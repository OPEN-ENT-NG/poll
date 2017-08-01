import { pollController } from './controller';
import { model, http, ng } from 'entcore';
import { pollModel } from './model';

ng.controllers.push(pollController);

/**
 * Allows to create a model and load the list of polls from the backend.
 */
model.build = function() {
    model.makeModels(pollModel);
    pollModel.polls = this.collection(pollModel.Poll, {
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