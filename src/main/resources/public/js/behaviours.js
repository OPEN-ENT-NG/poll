console.log('poll behaviours loaded');

/**
 * Define rights for behaviours.
 */
var pollBehaviours = {

    /**
     * Resources set by the user.
     */
    resources : {
        contrib : {
            right : 'net-atos-entng-poll-controllers-PollController|vote'
        },
        manage : {
            right : 'net-atos-entng-poll-controllers-PollController|delete'
        }
    },

    /**
     * Workflow rights are defined by the administrator. This associates a name
     * with a Java method of the server.
     */
    workflow : {
        create : 'net.atos.entng.poll.controllers.PollController|create'
    },

    /**
     * Special rights for the sniplet part.
     */
    viewRights : [ "net-atos-entng-poll-controllers-PollController|list" ]
};

/**
 * Register behaviours.
 */
Behaviours.register('poll', {
    behaviours : pollBehaviours,

    loadResources: function(callback){
        http().get('/poll/list/all').done(function(infos) {
            var infosArray = _.map(infos, function(info){
                var threadIcon;
                if (!info.icon) {
                    threadIcon = '/img/icons/glyphicons_036_file.png';
                }
                else {
                    threadIcon = info.icon + '?thumbnail=48x48';
                }
                return {
                    title : info.question,
                    ownerName : info.unsername,
                    icon : threadIcon,
                    path : '/poll#/view/' + info._id,
                    id : info._id,
                };
            });
            this.resources = _.compact(_.flatten(infosArray));
            if(typeof callback === 'function'){
                callback(this.resources);
            }
        }.bind(this));
    },

    /**
     * Allows to set rights for behaviours.
     */
    resourceRights : function(resource) {
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

    /**
     * Allows to load workflow rights according to rights defined by the
     * administrator for the current user in the console.
     */
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

    /**
     * Allows to define the poll sniplet
     */
    sniplets : {
        poll : {
            title : 'poll.sniplet.title',
            description : 'poll.sniplet.title',
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
                        this.content = {};
                        this.content.poll = p;
                        this.content.hasAlreadyVoted = this.hasAlreadyVoted(p);
                        this.content.hasExpired = this.hasExpired(p);
                        this.content.totalVotes = this.getTotalVotes(p);

                        Behaviours.applicationsBehaviours.poll.resourceRights(this.content.poll);
                        
                        this.$apply();
                    }.bind(this)).error(function(jqXHR, textStatus, errorThrown){
                        console.log("Erreur:"+jqXHR.status);
                    });
                },
                
                /** Function used by application "Pages", to copy rights from "Pages" to resources. 
                 * It returns an array containing all resources' ids which are concerned by the rights copy.
                 * For sniplet "poll", copy rights from "Pages" to associated poll
                 * @param source
                 */
                getReferencedResources: function(source){
                    if(source._id){
                        return [source._id];
                    }
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
                 * Allows to vote into the current poll.
                 */
                vote : function() {
                    // Update vote
                    var answer = this.content.poll.answers[this.content.selected];
                    if (answer.votes === undefined) {
                        answer.votes = [];
                    }
                    answer.votes.push(model.me.userId);
                    
                    // Vote
                    var poll = {};
                    poll.icon = this.content.poll.icon;
                    poll.question = this.content.poll.question;
                    poll.end = this.content.poll.end;
                    poll.answers = this.content.poll.answers;

                    http().putJson('/poll/vote/' + this.content.poll._id, poll);

                    // Update current view
                    delete this.content.selected;
                    this.content.hasAlreadyVoted = true;
                    this.content.totalVotes++;
                },

                /**
                 * Allows to get if the current user has already voted for the
                 * given poll. This method search for the user identifier in the
                 * list of votes in the list of answers.
                 * @param p a poll to test.
                 * @return true if the user has already voted in the given poll.
                 */
                hasAlreadyVoted : function(p) {
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
                },

                /**
                 * Allows to get if the given poll has expired.
                 * @param p a poll to test.
                 * @return true if the given poll has expired.
                 */
                hasExpired : function(p) {
                    return p && moment().isAfter(p.end);
                },
                
                /**
                 * Allows to get the total number of votes of the given poll.
                 * @param p a poll.
                 * @return the total number of votes of the given poll.
                 */
                getTotalVotes : function(p) {
                    var result = 0;
                    if (p.answers) {
                        for (var i = 0; i < p.answers.length; i++) {
                            var answer = p.answers[i];
                            if (answer.votes) {
                                result += answer.votes.length;
                            }
                        }
                    }
                    return result;
                }
            }
        }
    }
});