
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

    // By default open the polls list
    template.open('polls', 'poll-list');

    /**
     * Allows to open the given poll into the "main" div using the
     * "poll-view.html" template.
     * @param poll the current poll to open.
     */
    $scope.openPoll = function(poll) {
        $scope.poll = poll;
        $scope.hideAlmostAllButtons(poll);
        $scope.totalVotes = $scope.getTotalVotes(poll);
        template.open('main', 'poll-view');
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
        $scope.hideAlmostAllButtons();
        template.close('main');
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
            var answers = $scope.poll.answers;
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
}
