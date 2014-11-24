var pollBehaviours = {
	resources: {
		manage: {
			right: 'net-atos-entng-poll-controllers-PollController|delete'
		}
	}
};

Behaviours.register('poll', {
	behaviours: pollBehaviours,
	resource: function(resource){
		var rightsContainer = resource;
		if(!resource.myRights){
			resource.myRights = {};
		}

		for(var behaviour in pollBehaviours.resources){
			if(model.me.hasRight(rightsContainer, pollBehaviours.resources[behaviour]) 
					|| model.me.userId === resource.owner.userId 
					|| model.me.userId === rightsContainer.owner.userId){
				if(resource.myRights[behaviour] !== undefined){
					resource.myRights[behaviour] = resource.myRights[behaviour] && pollBehaviours.resources[behaviour];
				}
				else{
					resource.myRights[behaviour] = pollBehaviours.resources[behaviour];
				}
			}
		}
		return resource;
	},
	workflow: function(){
		var workflow = { };
		var pollWorkflow = pollBehaviours.workflow;
		for(var prop in pollWorkflow){
			if(model.me.hasWorkflow(pollWorkflow[prop])){
				workflow[prop] = true;
			}
		}

		return workflow;
	},
	resourceRights: function(){
		return ['read', 'contrib', 'publish', 'manager']
	}
});