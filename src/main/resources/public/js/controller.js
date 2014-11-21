
function PollController($scope, template, model) {
    $scope.template = template;
    $scope.polls = model.polls;
    $scope.me = model.me;

    template.open('polls', 'polls');
    
    $scope.newPoll = function() {
        $scope.poll = new Poll();
        template.open('main', 'edit-poll');
    };

    $scope.openPoll = function(poll) {
        $scope.poll = poll;
        template.open('main', 'edit-poll');
    };

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
    
    $scope.cancelPollEdit = function(){
        delete $scope.poll;
        template.close('main');
    };

}