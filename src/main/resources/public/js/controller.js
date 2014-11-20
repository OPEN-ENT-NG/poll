routes.define(function($routeProvider) {
    $routeProvider.otherwise({
        action : 'mainPage'
    });
});

function PollController($scope, template, route) {
    $scope.template = template;
    $scope.found = true;

    route({
        mainPage : function() {
            template.open('polls', 'polls');
        }
    });

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
                    $scope.cancelCategoryEdit();
                    $scope.$apply();
                });
            });
        } else {
            $scope.poll.save();
            $scope.polls.sync();
        }
        template.close('main');
    };

    $scope.openMainPage = function() {
        delete $scope.poll;
        template.close('main');
    };

}