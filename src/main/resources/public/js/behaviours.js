var pollBehaviours = {
    resources : {
        manage : {
            right : 'net-atos-entng-poll-controllers-PollController|delete'
        }
    },
    workflow : {
        admin : 'net-atos-entng-poll-controllers-PollController|create'
    },
    viewRights : [ "net-atos-entng-poll-controllers-PollController|list" ]
};

Behaviours.register('poll', {
    behaviours : pollBehaviours,
    resource : function(resource) {
        var rightsContainer = resource;
        if (!resource.myRights) {
            resource.myRights = {};
        }

        for ( var behaviour in pollBehaviours.resources) {
            if (model.me.hasRight(rightsContainer, pollBehaviours.resources[behaviour]) || model.me.userId === resource.owner.userId || model.me.userId === rightsContainer.owner.userId) {
                if (resource.myRights[behaviour] !== undefined) {
                    resource.myRights[behaviour] = resource.myRights[behaviour] && pollBehaviours.resources[behaviour];
                } else {
                    resource.myRights[behaviour] = pollBehaviours.resources[behaviour];
                }
            }
        }
        return resource;
    },
    workflow : function() {
        var workflow = {};
        var pollWorkflow = pollBehaviours.workflow;
        for ( var prop in pollWorkflow) {
            if (model.me.hasWorkflow(pollWorkflow[prop])) {
                workflow[prop] = true;
            }
        }

        return workflow;
    },
    resourceRights : function() {
        return [ 'read', 'contrib', 'manager' ]
    },
    sniplets : {
        poll : {
            title : 'Sondage',
            description : 'Participer a un sondage',
            controller : {

                /**
                 * Allows to load the list of polls to display in a lightbox of
                 * selection. The user click on one of them. This set the object
                 * "source" in the model with the id of the selected poll.
                 */
                initSource : function() {
                    http().get('/poll/list/all').done(function(data) {
                        this.polls = data;
                        this.$apply();
                    }.bind(this));
                },

                /**
                 * Allows to load the poll associated to "this.source._id". In
                 * the view the selected poll is set into "this.poll" variable.
                 */
                init : function() {
                    http().get('/poll/' + this.source._id).done(function(p) {
                        this.poll = p;
                        this.$apply();
                    }.bind(this));
                },
                
                /**
                 * Allows to copy all rights of polls
                 * @param snipletResource
                 * @param source
                 */
                copyRights : function(snipletResource, source) {
                    source.polls.forEach(function(poll) {
                        Behaviours.copyRights(snipletResource, poll, pollBehaviours.viewRights, 'poll');
                    });
                },

                /**
                 * Allows to vote into the given poll.
                 * @param p a poll.
                 */
                vote : function(p) {
                    var poll = angular.copy(p);
                    var answer = poll.answers[poll.selected];

                    if (answer.votes === undefined) {
                        answer.votes = [];
                    }

                    answer.votes.push(model.me.userId);
                    delete poll.selected;

                    http().putJson('/poll/' + poll._id, poll);
                },

                /**
                 * Allows to get if the current user has already vote for the
                 * given poll. This method search for the user identifier in the
                 * list of votes in the list of answers.
                 * @param p a poll to test.
                 * @return true if the user has already vote in the given poll.
                 */
                hasVote : function(p) {
                    if (p && p.answers) {
                        for (var i = 0; i < p.answers.length; i++) {
                            var answer = p.answers[i];
                            if (answer.votes) {
                                for (var j = 0; j < answer.votes.length; j++) {
                                    if (answer.votes[j] === model.me.userId) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    return false;
                }
            }
        }
    }
});