
/**
 * Controller for polls. All methods contained in this controller can be called
 * from the view.
 * @param $scope Angular JS model.
 * @param template all templates.
 * @param model the poll model.
 */
function PollController($scope, template, model) {
    $scope.template = template;
    $scope.polls = model.polls;
    $scope.me = model.me;
    $scope.display = {};
    $scope.pollSelected = [];
    $scope.searchbar = {}
    $scope.selectedAnswer = 0;

    // By default open the polls list
    template.open('main', 'poll-list');
    template.open('side-panel', 'side-panel');

    /**
     * Allows to open the given poll into the "main" div using the
     * "poll-view.html" template.
     * @param poll the current poll to open.
     */
    $scope.openPoll = function(poll) {
        $scope.poll = poll;
        $scope.hideAlmostAllButtons(poll);
        $scope.pollmodeview = true;
        $scope.totalVotes = $scope.getTotalVotes(poll);
        template.open('main', 'poll-view');
        template.close('polls');
    };
    
    /**
     * Allows to create a new poll and open the "poll-edit.html" template into
     * the "main" div. By default, the end of the poll is set to now + 7.
     */
    $scope.newPoll = function() {
        $scope.poll = new Poll();
        $scope.poll.end = moment().add(7, 'days').toDate();
        $scope.poll.answers = [];
        $scope.poll.answers.push(new Answer());
        $scope.poll.answers.push(new Answer());
        $scope.totalVotes = 0;
        template.open('main', 'poll-edit');
    };

    /**
     * Allows to edit the given poll into the "main" div using the
     * "poll-edit.html" template. This method create two variables in the scope :
     * <ul>
     * <li>master : keep a reference to the current edited poll.</li>
     * <li>poll : a copy of the given poll to edit.</li>
     * </ul>
     * @param poll the current poll to edit.
     * @param event the current event.
     */
    $scope.editPoll = function(poll, event) {
        poll.showButtons = false;
        $scope.master = poll;
        $scope.poll = angular.copy(poll);
        $scope.totalVotes = $scope.getTotalVotes(poll);
        event.stopPropagation();
        template.open('main', 'poll-edit');
    };
    
    /**
     * Allows to set "showButtons" to false for all polls except the given one.
     * @param poll the current selected poll.
     */
    $scope.hideAlmostAllButtons = function(poll) {
        $scope.polls.forEach(function(p) {
            if(!poll || p._id !== poll._id){
                p.showButtons = false;
            }
        });
    };
    
    /**
     * Allows to cancel the current poll edition. This method removes the "poll"
     * variable and close the "main" template.
     */
    $scope.cancelPollEdit = function() {
        delete $scope.master;
        delete $scope.poll;
        $scope.pollSelected = [];
        $scope.hideAlmostAllButtons();
        $scope.pollmodeview = false;
        template.close('main');
        template.open('main', 'poll-list');
    };

    /**
     * Allows to save the current edited poll in the scope. After saving the
     * current poll this method closes the edit view too.
     */
    $scope.savePoll = function() {
        $scope.master = angular.copy($scope.poll);
        $scope.master.save(function() {
            $scope.polls.sync(function() {
                $scope.cancelPollEdit();
                updateSearchBar();
                $scope.pollSelected = [];
            });
        });
       
        
    };

    /**
     * Allows to put the current poll in the scope and set "confirmDeletePoll"
     * variable to "true".
     * @param poll the poll to delete.
     * @param event an event.
     */
    $scope.confirmRemovePoll = function(poll, event) {
        $scope.poll = poll;
        $scope.display.confirmDeletePoll = true;
        event.stopPropagation();
    };
    
    /**
     * Allows to cancel the current delete process.
     */
    $scope.cancelRemovePoll = function() {
        delete $scope.display.confirmDeletePoll;
    };
    
    /**
     * Allows to remove the current poll in the scope.
     */
    $scope.removePoll = function() {
        $scope.poll.delete();
        delete $scope.display.confirmDeletePoll;
        delete $scope.poll;
        template.close('main');
    };
    
    /**
     * Allows to open the "share" panel by setting the
     * "$scope.display.showPanel" variable to "true".
     * @param poll the poll to share.
     * @param event the current event.
     */
    $scope.sharePoll = function(poll, event){
        $scope.poll = poll;
        $scope.display.showPanel = true;
        event.stopPropagation();
    };

    /**
     * Allows to add a new answer in the poll object.
     */
    $scope.addNewAnswer = function() {
        if ($scope.poll != null) {
            if ($scope.poll.answers === undefined) {
                $scope.poll.answers = [];
            }
            $scope.poll.answers.push(new Answer());
        }
    };

    /**
     * Allows to remove an answer at the given index.
     * @param index the index of the answer to remove of the list
     */
    $scope.removeAnswer = function(index) {
        if ($scope.poll != null) {  
            var answers = $scope.poll.answers;
            if (answers != null && index >= 0 && index < answers.length) {
                answers.splice(index, 1);
            }
        }
    };
    
    /**
     * Allows to move up the answer given by its index.
     * @param index the index of the answer to move up.
     */
    $scope.moveUpAnswer = function(index) {
        if ($scope.poll != null) {  
            var answers = $scope.poll.anlswers;
            if (answers != null && index > 0 && index < answers.length) {
                var tmp = answers[index - 1];
                answers[index - 1] = answers[index];
                answers[index] = tmp;
            }
        }
    }
    
    /**
     * Allows to move down the answer given by its index.
     * @param index the index of the answer to move down.
     */
    $scope.moveDownAnswer = function(index) {
        if ($scope.poll != null) {  
            var answers = $scope.poll.answers;
            if (answers != null && index >= 0 && index < answers.length - 1) {
                var tmp = answers[index + 1];
                answers[index + 1] = answers[index];
                answers[index] = tmp;
            }
        }
    }
    
    /**
     * Allows to get if the given poll has expired.
     * @param p a poll to test.
     * @return true if the given poll has expired.
     */
    $scope.hasExpired = function (p) {
        return p && moment().isAfter(p.end);
    };

    /**
    * Return true if current the user already voted
    * @param p a poll to test
    * @return true if the current user already voted
    */
    $scope.hasAlreadyVoted = function (p) {
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
    };
    
    /**
    * Allows an user to vote for seleted poll
    * @param vote index' answer
    *
    */
    $scope.vote = function(vote){
        if($scope.poll.answers[vote].votes === undefined){
            $scope.poll.answers[vote].votes = [];

        }
        $scope.poll.answers[vote].votes.push(model.me.userId);
        http().putJson('/poll/vote/' + $scope.poll._id, $scope.poll);
        hasAlreadyVoted = true;
        $scope.totalVotes++;

    };
    
    /**
     * Allows to get the total number of votes of the given poll.
     * @param poll a poll.
     * @return the total number of votes of the given poll.
     */
    $scope.getTotalVotes = function(poll) {
        var result = 0;
        if (poll.answers) {
            for (var i = 0; i < poll.answers.length; i++) {
                var answer = poll.answers[i];
                if (answer.votes) {
                    result += answer.votes.length;
                }
            }
        }
        return result;
    };

    /**
    * Get all pool submitted by the current user
    *
    */
    $scope.getPollsSubmitted = function(){
        var pollsSubmitted= Array();
        for(var i = 0; i< $scope.polls.all.length; i++){
            if($scope.polls.all[i].owner.userId == $scope.me.userId){
                pollsSubmitted.push($scope.polls.all[i]);
            }
        }
        return pollsSubmitted;
    };

    /**
    * Get all pool who are shared to the current user
    *
    */
    $scope.getPollsShared = function(){
        var pollsShared= Array();
        for(var i = 0; i< $scope.polls.all.length; i++){
            if($scope.polls.all[i].owner.userId != $scope.me.userId){
                $scope.polls.all[i].shared.forEach(function(share) {
                    if(share.userId == $scope.me.userId){
                        pollsShared.push($scope.polls.all[i]);
                    }
                });
            }
        }
        return pollsShared;
    };

    /**
    * Get all poll unanswered and shared to the current user 
    *
    */
    $scope.getPollsUnanswered = function(){
        var pollsUnanswered= Array();
        var isAnswered; 
        $scope.getPollsShared().forEach(function(poll){
            isAnswered = false;
            poll.answers.forEach(function(answer){
                if(answer.votes){
                    answer.votes.forEach(function(vote){
                        if(vote == $scope.me.userId){
                            isAnswered = true;
                        }
                    });
                }
            });
            if(!isAnswered){
                pollsUnanswered.push(poll);
            }
        });
        return pollsUnanswered;
    };

    /**
    * Get all poll answered
    *
    */
    $scope.getPollsAnswered = function(){
        var pollsAnswered= Array();
        $scope.polls.all.forEach(function(poll){
            poll.answers.forEach(function(answer){
              if(answer.votes) {
                answer.votes.forEach(function(vote){
                    if(vote == $scope.me.userId && poll.owner.userId !=$scope.me.userId){
                        pollsAnswered.push(poll);
                    }
                });
              }
            });
        });
        return pollsAnswered;
    };
    $scope.hasManageRight = function(poll){
        return poll && poll.myRights.manage;
    };

    /**
    * Add and delete polls selected in pollSelected array
    * @param poll
    */
    $scope.togglePollSelected = function(poll){

        if($scope.pollSelected.indexOf(poll)>=0){
            $scope.pollSelected.splice($scope.pollSelected.indexOf(poll),1);
        }else{
            $scope.pollSelected.push(poll);
        }
    };

     /**
     * Allows to put the current poll in the scope and set "confirmDeletePoll"
     * variable to "true".
     * @param poll the poll to delete.
     * @param event an event.
     */
    $scope.confirmRemovePolls = function(polls, event) {
       // $scope.poll = poll;
        $scope.display.confirmDeletePoll = true;
        event.stopPropagation();
    };

    /**
    * Allows to remove several polls
    */
    $scope.removePolls = function(){


        _.map($scope.pollSelected, function(pollToRemove){
            pollToRemove.delete( function(){
                // Update search bar, without any server call
                $scope.searchbar = _.filter($scope.searchbar, function(poll){
                    return poll._id !== pollToRemove._id;
                });
            });
        });
        delete $scope.display.confirmDeletePoll;
    };

    var updateSearchBar = function(){
        $scope.polls.sync(function() {
            $scope.searchbar =_.map($scope.polls.all, function(poll){
                return {
                    title : poll.question,
                    _id : poll._id,
                    toString : function() {
                        return this.title;
                    }
                };

           });
        });
    };
    updateSearchBar();

    /**
    * Open poll from a searchbar
    * @param poll's id
    */
    $scope.openPollFromSearchbar = function(pollId){
        //window.location.hash = '/view/' + pollId;
        $scope.openPoll($scope.getPollById(pollId));

    };

    /**
    * Check if an user ar editing a poll.
    */
    $scope.isCreatingOrEditing = function(){
            return (template.contains('main', 'poll-edit'));
    };

    /**
    * Get a poll with an id
    * @param Poll._id
    * @return poll
    */
    $scope.getPollById = function(pollId){
        return _.find(model.polls.all, function(poll){
            return poll._id === pollId;
        });
    };

}
