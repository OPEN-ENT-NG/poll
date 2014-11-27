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
            description : 'Voter a un sondage',
            controller : {
                initSource : function() {
                    this.list();
                },
                init : function() {
                    this.list();
                },
                copyRights : function(snipletResource, source) {
                    source.polls.forEach(function(poll) {
                        Behaviours.copyRights(snipletResource, poll, pollBehaviours.viewRights, 'poll');
                    });
                },
                list : function() {
                    http().get('/poll/list/all').done(function(data) {
                        this.polls = data;
                        this.$apply();
                    }.bind(this));
                },
                vote : function(poll) {

                }
            }
        }
    }
});