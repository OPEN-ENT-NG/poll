
/**
 * Controller for polls
 * @param $scope Angular JS model
 * @param template
 * @param model
 */
function PollController($scope, template, model) {
    $scope.template = template;
    $scope.polls = model.polls;
    $scope.me = model.me;
    $scope.display = {};

    // By default open the polls list
    template.open('polls', 'poll-list');

    /**
     * Allows to create a new poll and open the "poll-edit.html" template into
     * the "main" div.
     */
    $scope.newPoll = function() {
        $scope.poll = new Poll();
        template.open('main', 'poll-edit');
    };

    /**
     * Allows to open the given poll into the "main" div using the
     * "poll-edit.html" template.
     * @param poll the current poll to open.
     */
    $scope.openPoll = function(poll) {
        $scope.poll = poll;
        template.open('main', 'poll-edit');
    };
    
    /**
     * Allows to cancel the current poll edition. This method removes the "poll"
     * variable and close the "main" template.
     */
    $scope.cancelPollEdit = function() {
        delete $scope.poll;
        template.close('main');
    };

    /**
     * Allows to save the current edited poll in the scope. After saving the
     * current poll this method closes the edit view too.
     */
    $scope.savePoll = function() {
        if ($scope.poll._id) {
            $scope.poll.save(function() {
                $scope.poll.sync(function() {
                    $scope.cancelPollEdit();
                    $scope.$apply();
                });
            });
        } else {
            $scope.poll.save();
            $scope.polls.sync();
        }
        template.close('main');
    };

    /**
     * Allows to put the current poll in the scope and set "confirmDeletePoll"
     * variable to "true".
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
        delete $scope.poll;
        delete $scope.display.confirmDeletePoll;
    };
    
    /**
     * Allows to remove the current poll in the scope.
     */
    $scope.removePoll = function() {
        $scope.poll.delete();
        delete $scope.display.confirmDeletePoll;
    };
    
}