// CONTROLLERS

/* MAIN  CONTROLLER*/
gameApp.controller("mainCtrl", ["$rootScope", "$scope", "$location", "feedbackService",
    function($rootScope, $scope, $location, feedbackService) {

        // feedback message
        $scope.feedbackMessage = false;
        $scope.switchMsg = function() {
            $scope.feedbackMessage = true;
        }

        // check if current url is play
        $rootScope.checkUrl = function() {
            var isPlay = false;
            if ($location.url() === '/play') {
                isPlay = true;
            }
            return isPlay;
        }

        // fetch all feedbacks
        $scope.getFeedbacks = feedbackService.query();

        // add new feedback
        $scope.addNewFeedback = function() {
            var newFeedBack = new feedbackService({
                name: $scope.name,
                email: $scope.email,
                subject: $scope.subject,
                message: $scope.message,
                position: $scope.position,
                age: $scope.age,
                clear: $scope.clear,
                difficult: $scope.difficult,
                intersting: $scope.intersting,
                challenging: $scope.challenging,
                design: $scope.design
            });
            newFeedBack.$save(function() {
                $scope.getFeedbacks.push(newFeedBack);
            });
        };

        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };

        $('.navbar-nav>li>a').on('click', function() {
            $('.navbar-collapse').collapse('hide');
        });

    }
]);

/*  HOME CONTROLLER */
gameApp.controller("homeCtrl", [
    "$rootScope",
    "$scope",
    "$location",
    "$route",
    "$http",
    "localStorageService",
    "userService",
    "guestService",
    "authService",
    "currentUserService",
    "$ngConfirm",
    function($rootScope, $scope, $location, $route, $http, localStorageService, userService, guestService, authService, currentUserService, $ngConfirm) {

        $rootScope.pageClass = 'home';
        $rootScope.sidebar = false;
        $scope.isNewUser = false;
        $scope.swtichLogin = true;
        $rootScope.scoreNavbar = false;

        // set local storage fro new user
        $rootScope.localStorageNewUser = localStorageService.get("localStorageNewUser");
        // watch on localStorageNewUser i view
        $scope.$watch("localStorageNewUser", function(value) {
            localStorageService.set("localStorageNewUser", value);
            $scope.localStorageNewUserValue = localStorageService.get("localStorageNewUser");
        });
        // local storage type is local storage
        $scope.storageType = "Local storage";
        // local storage type is session
        if (localStorageService.getStorageType().indexOf("session") >= 0) {
            $scope.storageType = "Session storage";
        }
        // local storage type is cookie
        if (!localStorageService.isSupported) {
            $scope.storageType = "Cookie";
        }
        // watch the scope for local storage new user
        $scope.$watch(
            function() {
                return localStorageService.get("localStorageNewUser");
            },
            function(value) {
                $rootScope.localStorageNewUser = value;
            }
        );

        // fetch all users. Issues a GET to /users
        $rootScope.users = userService.query();

        // fetch all guests. Issues a GET to /users/guests
        $scope.allGuests = guestService.query();

        // New Guest
        $http.get("https://ipinfo.io/json")
            .then(function(response) {
                $scope.status = response.status;
                userIP = response.data.ip;
                $scope.addNewGuest = function() {
                    var guest = new userService({
                        username: "Guest" + $scope.allGuests.length,
                        isGuest: true,
                        userIP: userIP
                    });
                    guest.$save(function() {
                        $rootScope.users.push(guest);
                    });
                    localStorageService.set("localStorageNewUser", guest.username);
                    // $location.path("/play");
                    $location.path("/instruction");
                };
            }, function(response) {
                userIP = -1 || 'Request failed';
                $scope.status = response.status;
                $scope.addNewGuest = function() {
                    var guest = new userService({
                        username: "Guest" + $scope.allGuests.length,
                        isGuest: true,
                        userIP: userIP
                    });
                    guest.$save(function() {
                        $rootScope.users.push(guest);
                    });
                    localStorageService.set("localStorageNewUser", guest.username);
                    // $location.path("/play");
                    $location.path("/instruction");
                };
            });

        $scope.register = function() {
            if ($scope.signupForm.$valid) {
                // $scope.userRegister = authService.register($scope.username, $scope.password);
                authService.register($scope.username, $scope.password).then(function(response) {
                    $scope.status = response.status;
                    $scope.data = response.data;
                    if ($scope.data.success) {
                        localStorageService.set("localStorageNewUser", $scope.username);
                        // $location.path("/play");
                        $location.path("/instruction");
                    } else {
                        $scope.registrationErrorMsg = $scope.data.msg
                        console.log($scope.registrationErrorMsg);
                    }
                }, function(response) {
                    $scope.data = response.data || 'Registration failed!';
                    $scope.status = response.status;
                });
            }
        };

        $scope.login = function() {
            if ($scope.loginForm.$valid) {
                authService.login($scope.username, $scope.password).then(function(response) {
                    $scope.status = response.status;
                    $scope.data = response.data;
                    if ($scope.data.success) {
                        localStorageService.set("localStorageNewUser", $scope.username);
                        // $location.path("/play");
                        $location.path("/play");
                    } else {
                        $scope.loginErrorMsg = $scope.data.msg
                        console.log($scope.loginErrorMsg);
                        $location.path("/");
                    }
                }, function(response) {
                    $scope.data = response.data || 'Login failed!';
                    console.log($scope.data);
                    $scope.status = response.status;

                });
            }
        };

        // If users logged in, set it as current user
        if ($rootScope.localStorageNewUser) {
            $scope.currentUser = currentUserService.get({
                username: $rootScope.localStorageNewUser
            });
        } else {
            $location.path("/");
        }

        $scope.logout = function() {
            if ($scope.currentUser.isGuest) {
                $ngConfirm({
                    theme: 'supervan',
                    closeIcon: true,
                    closeIconClass: 'fas fa-times',
                    icon: 'fas fa-exclamation-circle',
                    animation: 'zoom',
                    closeAnimation: 'scale',
                    title: 'Attention!',
                    content: 'Are you sure to sign out? You will lose all your data and score after sign out.',
                    scope: $scope,
                    buttons: {
                        goBack: {
                            text: 'Go back',
                            btnClass: 'btn-blue',
                            action: function(scope, button) {
                                return true;
                            }
                        },
                        logout: {
                            text: 'sign out',
                            btnClass: 'btn-red',
                            action: function(scope, button) {
                                localStorageService.remove("localStorageNewUser");
                                $route.reload();
                            }
                        },
                    }
                });
            } else {
                localStorageService.remove("localStorageNewUser");
                $route.reload();
            }
        };

    }
]);


/* INSTRUCTION CONTROLLER */
gameApp.controller("instructionCtrl", ["$rootScope", "$scope", "$location", "localStorageService", "currentUserService",
    function($rootScope, $scope, $location, localStorageService, currentUserService) {

        $rootScope.pageClass = 'instruction';
        $rootScope.sidebar = false;
        $rootScope.scoreNavbar = false;

        // get local storage new user
        $rootScope.localStorageNewUser = localStorageService.get("localStorageNewUser");
        $rootScope.$watch("localStorageNewUser", function(value) {
            localStorageService.set("localStorageNewUser", value);
            $rootScope.localStorageNewUserValue = localStorageService.get(
                "localStorageNewUser"
            );
        });

        // If users logged in, set it as current user
        if ($rootScope.localStorageNewUser) {
            $scope.currentPlayer = currentUserService.get({
                username: $rootScope.localStorageNewUser
            });
        }

        /* CURRENT USER PROMISE*/
        $scope.currentPlayer.$promise.then(function(res) {
            $scope.userLevel = res.level;

        });
    }
]);

/* PLAY CONTROLLER */
gameApp.controller("playCtrl", [
    "$rootScope",
    "$scope",
    "$filter",
    "$route",
    "$location",
    "$timeout",
    "$ngConfirm",
    "localStorageService",
    "currentUserService",
    "getUserByIdService",
    "randomSentenceService",
    "commentService",
    "randomCommentService",
    "currentCommentService",
    "levenshtein",
    "watchKeywords",
    "rewardService",
    "getChangedWordsList",
    "getOriginalSentenceWordsList",
    "seqAlignService",
    "genderWordsListService",
    "negativeWordsListService",
    function(
        $rootScope,
        $scope,
        $filter,
        $route,
        $location,
        $timeout,
        $ngConfirm,
        localStorageService,
        currentUserService,
        getUserByIdService,
        randomSentenceService,
        commentService,
        randomCommentService,
        currentCommentService,
        levenshtein,
        watchKeywords,
        rewardService,
        getChangedWordsList,
        getOriginalSentenceWordsList,
        seqAlignService,
        genderWordsListService,
        negativeWordsListService
    ) {

        $rootScope.pageClass = 'play';
        $rootScope.sidebar = true;
        $rootScope.scoreNavbar = true;

        $rootScope.localStorageNewUser = localStorageService.get("localStorageNewUser");

        // Fetch a random sentence for unsexistifyit challenge. Issues a GET to /sentences
        $scope.currentSentence = randomSentenceService.get();

        // Fetch all comments. Issues a GET to /comments
        $scope.comments = commentService.query();

        // Fetch a random comment for rating challenge. Issues a GET to /comments
        $scope.getRandomComment = randomCommentService.get();

        // If users logged in, set it as current user
        if ($rootScope.localStorageNewUser) {
            $scope.currentPlayer = currentUserService.get({
                username: $rootScope.localStorageNewUser
            });
        } else {
            $location.path("/");
        }

        // COPY BUTTON
        $rootScope.supported = false;
        $scope.isCopied = false;
        $rootScope.success = function() {
            $scope.isCopied = true;
            $timeout(function() {
                $scope.isCopied = false;
            }, 2000);
        };
        $rootScope.fail = function(err) {
            console.error('Error!', err);
        };

        var startTime = new Date();
        $scope.stopwatch = 0;

        $scope.levelTwoMinScore = 200;


        /* CURRENT USER PROMISE*/
        $scope.currentPlayer.$promise.then(function(res) {

            $scope.currentUser = res;
            $rootScope.currentUserCommentScore = res.commentScore;
            $rootScope.currentUserRateScore = res.rateScore;
            $rootScope.totalScore = res.totalScore;
            if (typeof res.comments !== "undefined")
                $rootScope.numberOfComments = res.comments.length;
            if (typeof res.ratedOn !== "undefined")
                $rootScope.numberOfRates = res.ratedOn.length;
            if (typeof res.round !== "undefined")
                $rootScope.round = res.round;
            $scope.numberOfRounds = res.round.length;
            $rootScope.userLevel = res.level;
            $scope.skipped = res.skipped;
            $rootScope.userID = res._id;
            $scope.isContinued = res.isContinued;

            // update current user commentScore
            $scope.updateUserCommentScore = function() {
                $scope.currentUser.commentScore = $rootScope.currentUserCommentScore + rewardService.computeCommentScore($scope.sequenceAlignment, $scope.originalSentenceWordsList);
                return $scope.currentUser.commentScore;
            };

            // update current user totalScore
            $scope.updateUserTotalScore = function() {
                $scope.currentUser.totalScore = $rootScope.totalScore + rewardService.computeCommentScore($scope.sequenceAlignment, $scope.originalSentenceWordsList);
                return $scope.currentUser.totalScore;
            };

            // update current user round played counter
            $scope.playedRound = function() {
                $scope.currentUser.round = $rootScope.round + 1;
                return $scope.currentUser.round;
            };

            // update current user skipped counter
            $scope.countSkipped = function() {
                $scope.currentUser.skipped = $scope.skipped + 1;
                return $scope.currentUser.skipped;
            }

            // update current user skipped counter
            $scope.upgradeLevel = function() {
                // $rootScope.userLevel = $rootScope.userLevel + 1;
                $scope.currentUser.level = $rootScope.userLevel + 1;
                // console.log("level upgraded");
                $rootScope.levelUpgraded = true;
                return $scope.currentUser.level;
                // return $rootScope.userLevel;
            }

            // ADD NEW COMMENT IN UNSEXISTIFYIT CHALLENGE
            $scope.addComment = function() {

                $scope.stopwatch = (new Date() - startTime) / 1000;

                $scope.newComment = new commentService({
                    content: $scope.content,
                    commentedOn: $scope.currentSentence,
                    postedBy: $scope.currentUser,
                    commentScore: rewardService.computeCommentScore($scope.sequenceAlignment, $scope.originalSentenceWordsList),
                    timeSpent: $scope.stopwatch
                });

                // compute current comment score
                $rootScope.currentCommentScore = rewardService.computeCommentScore($scope.sequenceAlignment, $scope.originalSentenceWordsList);

                // update player comment score
                $scope.updateUserCommentScore();

                // update player total score
                $scope.updateUserTotalScore();

                // round played
                $scope.playedRound();

                $rootScope.levelUpgraded = false;
                if (($scope.currentUser.totalScore > $scope.levelTwoMinScore) && ($rootScope.userLevel == 1)) {
                    // if ($rootScope.totalScore > $scope.levelTwoMinScore) {
                    $scope.upgradeLevel();
                }

                // save new comment to comments collection
                var saveComment = $scope.newComment.$save(function() {
                    $scope.comments.push($scope.newComment);
                });

                saveComment.then(function(res) {

                    // push new comment to current sentence comments array
                    $scope.currentSentence.comments.push(res);

                    // push current user who commented to current sentence
                    $scope.currentSentence.commentedBy.push($scope.currentUser);

                    // update current sentence
                    randomSentenceService.update({
                        id: $scope.currentSentence._id
                    }, $scope.currentSentence);

                    // push current comment on current sentence by current user
                    $scope.currentUser.comments.push(res);

                    // push current sentence which newly commented on by current user
                    // $scope.currentUser.commentedOn.push($scope.currentSentence);

                    // update current user by newly added sentence
                    currentUserService.update({
                        username: $scope.currentUser.username
                    }, $scope.currentUser);
                });


                if ($rootScope.levelUpgraded == true) {
                    // show level upgrade modal
                    $timeout(function() {
                        angular.element(document.querySelector('#closeModal')).click();
                        angular.element('#scoreModal').modal('hide');
                        $location.url("/instruction#rating");
                        angular.element('body').removeClass('modal-open');
                        angular.element('.modal-backdrop').remove();

                    }, 4000);
                } else {
                    $timeout(function() {
                        angular.element(document.querySelector('#closeModal')).click();
                        $route.reload();
                    }, 1000);
                }

                // switch the view
                $scope.playing = false;

            };
            // END OF ADD COMMENT

            // RATE ON A COMMENT 
            $scope.getRandomComment.$promise.then(function(response) {
                $scope.randomComment = response;
                $scope.commentRateScore = response.rateScore;
                console.log("active player:", $scope.currentUser.username);
                $scope.commentAuthor = getUserByIdService.get({
                    id: $scope.randomComment.postedBy
                });

                // get auther of the comment
                $scope.commentAuthor.$promise.then(function(res) {
                    $scope.author = res;
                    $scope.authorTotalScore = res.totalScore;
                    $scope.authorRateScore = res.rateScore;
                    console.log('author:', res.username);
                    console.log('author score:', res.totalScore);
                    console.log('author comment score:', res.commentScore);
                    console.log('author rate score:', res.rateScore);

                    $scope.$watch('rate', function(value) {
                        if (value) {
                            rate = value;

                            // compute current rate score
                            $rootScope.currentRateScore = rewardService.computeRateScore(rate);

                            // update author rate score based on given rate by active player
                            $scope.updateAuthorRateScore = function() {
                                $scope.author.rateScore = $scope.authorRateScore + (rewardService.computeRateScore(rate));
                                return $scope.author.rateScore
                            }

                            // update author total score based on given rate by active player
                            $scope.updateAuthorTotalScore = function() {
                                $scope.author.totalScore = $scope.authorTotalScore + (rewardService.computeRateScore(rate));
                                return $scope.author.totalScore
                            }

                             // update author rate score based on given rate by active player
                            $scope.updateCommentRateScore = function() {
                                $scope.randomComment.rateScore = $scope.commentRateScore + (rewardService.computeRateScore(rate));
                                return $scope.randomComment.rateScore
                            }

                            // rated by active player
                            ratedBy = $scope.currentUser

                            $scope.addRating = function() {

                                // push new rating to current comment
                                $scope.randomComment.rating.push({
                                    rate: rate,
                                    ratedBy: ratedBy
                                });

                                // update author rate score
                                $scope.updateAuthorRateScore();

                                // update author total score
                                $scope.updateAuthorTotalScore();

                                getUserByIdService.update({
                                    id: $scope.author._id
                                }, $scope.commentAuthor);


                                $scope.updateCommentRateScore();
                                
                                // update current random comment
                                randomCommentService.update({
                                    id: $scope.getRandomComment._id
                                }, $scope.getRandomComment);

                                $scope.temp = currentCommentService.get({
                                    id: $scope.getRandomComment._id
                                });
                                $scope.temp.$promise.then(function(res) {
                                    $scope.ratedComment = res;
                                    $scope.currentUser.ratedOn.push($scope.ratedComment);
                                    currentUserService.update({
                                        username: $scope.currentUser.username
                                    }, $scope.currentUser);
                                })

                                // round played
                                $scope.playedRound();

                                // update active player info
                                currentUserService.update({
                                    username: $scope.currentUser.username
                                }, $scope.currentUser);


                                // show rating modal
                                $timeout(function() {
                                    // $scope.closeModal();
                                    angular.element(document.querySelector('#closeRatingModal')).click();
                                    $route.reload();
                                }, 1500);

                            }
                        }
                    });
                });
            });
            // END OF RATE ON A COMMENT


            // logout, remove local storage for guests
            $rootScope.logout = function() {
                if ($scope.currentUser.isGuest) {
                    $ngConfirm({
                        theme: 'supervan',
                        closeIcon: true,
                        closeIconClass: 'fas fa-times',
                        icon: 'fas fa-exclamation-circle',
                        animation: 'zoom',
                        closeAnimation: 'scale',
                        title: 'Attention!',
                        content: 'Are you sure to sign out? You will lose all your data and score after sign out.',
                        scope: $scope,
                        buttons: {
                            goBack: {
                                text: 'Go back',
                                btnClass: 'btn-blue',
                                action: function(scope, button) {
                                    return true;
                                }
                            },
                            logout: {
                                text: 'sign out',
                                btnClass: 'btn-red',
                                action: function(scope, button) {
                                    localStorageService.remove("localStorageNewUser");
                                    $route.reload();
                                }
                            },
                        }
                    });
                } else {
                    localStorageService.remove("localStorageNewUser");
                    $route.reload();
                }
            };

            // update user username
            // $scope.nameModify = false;
            // $scope.updateUsername = function() {
            //     currentUserService.update({
            //         username: $scope.currentUser.username
            //     }, {
            //         username: $scope.localStorageNewUser
            //     });
            //     $scope.$watch("localStorageNewUser", function(value) {
            //         localStorageService.set("localStorageNewUser", value);
            //         $scope.localStorageNewUserValue = localStorageService.get(
            //             "localStorageNewUser"
            //         );
            //     });
            // };

            // show continue modal when round equals to 6
            $scope.continuePlaying = function() {
                $ngConfirm({
                    theme: 'my-theme',
                    closeIcon: true,
                    closeIconClass: 'fas fa-times',
                    icon: 'fas fa-exclamation-circle',
                    animation: 'zoom',
                    closeAnimation: 'scale',
                    title: 'Attention!',
                    content: 'Please make sure you copied your ID before continue playing.',
                    scope: $scope,
                    buttons: {
                        goBack: {
                            text: 'Go back',
                            btnClass: 'btn-blue',
                            action: function(scope, button) {
                                return true;
                            }
                        },
                        continue: {
                            text: 'continue',
                            btnClass: 'btn-green',
                            action: function(scope, button) {
                                $scope.currentUser.isContinued = !$scope.currentUser.isContinued;
                                $scope.playedRound();
                                currentUserService.update({
                                    username: $scope.currentUser.username
                                }, $scope.currentUser);
                                angular.element('#continuePlaying').modal('hide');
                                $route.reload();
                                angular.element('body').removeClass('modal-open');
                                angular.element('.modal-backdrop').remove();
                                // return true;
                            }
                        },
                    }
                });
            }

            // logout, remove local storage for guests
            $scope.stopPlaying = function() {
                // $scope.goBack = 'want to back?';
                $ngConfirm({
                    theme: 'my-theme',
                    closeIcon: true,
                    closeIconClass: 'fas fa-times',
                    icon: 'fas fa-exclamation-circle',
                    animation: 'zoom',
                    closeAnimation: 'scale',
                    title: 'Attention!',
                    content: 'Please make sure you copied your ID before leaving.',
                    scope: $scope,
                    buttons: {
                        goBack: {
                            text: 'Go back',
                            btnClass: 'btn-blue',
                            action: function(scope, button) {
                                return true;
                            }
                        },
                        stop: {
                            text: 'stop playing',
                            btnClass: 'btn-orange',
                            action: function(scope, button) {
                                $ngConfirm('Thank you for playing our game!');
                                angular.element('#continuePlayingModal').modal('hide');
                                // localStorageService.remove("localStorageNewUser");
                                $location.path("/");
                                $route.reload();
                                angular.element('body').removeClass('modal-open');
                                angular.element('.modal-backdrop').remove();
                                // $ngConfirm('You clicked on something else');
                            }
                        },
                    }
                });
            }

        });
        /* END OF CURRENT USER PROMISE*/


        /* CURRENT SENTENCE PROMISE */
        $scope.currentSentence.$promise.then(function(response) {

            // $scope.currentPlayer = response;

            $scope.$watch('content', function() {
                var description = response.description;
                var content = $scope.content;

                if (typeof description !== "undefined" && typeof content !== "undefined") {
                    // compute levenshtein distance
                    $scope.changedWordsCounter = levenshtein.get(description, content);
                    // compute changed gender words 
                    $scope.changedGenderwordsNumber = watchKeywords.get(description, content, genderWordsListService);
                    // compute changed negation words
                    $scope.changedNegationsNumber = watchKeywords.get(description, content, negativeWordsListService);
                    // return changed words as an object includes 3 lists for genderwords, negativewords and other words
                    // $scope.changedWordsList = getChangedWordsList.get(description, content);
                    // return original sentence as an object includes 3 lists for genderwords, negativewords and other words
                    $scope.originalSentenceWordsList = getOriginalSentenceWordsList.get(description);
                    // return sequence alignment of given strings
                    $scope.sequenceAlignment = seqAlignService.get(description, content)
                }

                // console.log(genderWordsListService)
                // console.log(negativeWordsListService)

                $scope.isModified = false;
                if ($scope.changedWordsCounter == 0 || content == description || content == undefined) {
                    $scope.isModified = true;
                }

                // copy the original sentence description to input
                $scope.copyOriginal = function() {
                    $scope.content = $filter("uppercase")(description);
                };

            });

        });
        /* END OF CURRENT SENTENCE PROMISE */

        // toggle instructions

        $rootScope.toggle = false;
        // if (typeof $rootScope.round == "undefined" && typeof $rootScope.numberOfComments == "undefined") {
        //     $rootScope.toggle = true;
        // } else {
        //     $rootScope.toggle = false;
        // }

        $scope.$watch("toggle", function() {
            $rootScope.toggleText = $rootScope.toggle ? "HIDE QUICK INSTRUCTION" : "SHOW QUICK INSTRUCTION";
        });

        // instruction text toggle
        $scope.instructionsToggle = function() {
            $rootScope.toggle = !$rootScope.toggle;
        }

        // show instructions
        $rootScope.showInst = false;

        // skip button reload new sentence
        $scope.skipToNext = function() {
            // skipped current sentence
            $scope.countSkipped();
            currentUserService.update({
                username: $scope.currentUser.username
            }, $scope.currentUser);
            $route.reload();
        };

        // skip button reload new rating
        $scope.skipToNextRating = function() {
            // skipped current sentence
            $scope.countSkipped();
            currentUserService.update({
                username: $scope.currentUser.username
            }, $scope.currentUser);
            $route.reload();
        };

        $scope.showLevelModal = function() {
            if (($rootScope.totalScore > $scope.levelTwoMinScore) && ($rootScope.levelUpgraded)) {
                return true;
            } else {
                return false;
            }
        }

        $scope.showUnsexistifyit = function() {
            if ($rootScope.totalScore < $scope.levelTwoMinScore) {
                return true;
            } else if ($rootScope.round % 3 != 0) {
                return true;
            } else {
                return false;
            }
        }

        $scope.showRating = function() {
            if (($rootScope.totalScore < $scope.levelTwoMinScore) && ($rootScope.userLevel == 1)) {
                return false;
            } else if (($rootScope.round % 3 == 0) && ($rootScope.userLevel == 2)) {
                // angular.element('body').removeClass('modal-open');
                // angular.element('.modal-backdrop').remove();
                // $location.url("/instruction#rating");
                // angular.element(document.querySelector('#newLevelModal')).modal('show');
                // angular.element(document.querySelector('#newLevelModal')).show();
                return true;
            } else {
                return false;
            }
        }

        $rootScope.howToPlayRating = function() {
            angular.element(document.querySelector('#newLevelModal')).modal('hide');
            angular.element('body').removeClass('modal-open');
            angular.element('.modal-backdrop').remove();
            $location.url("/instruction#rating");
        }

    }
]);

/* PROFILE CONTROLLER */
gameApp.controller("profileCtrl", ["$rootScope", "$scope", "localStorageService", "currentUserService", "currentCommentService", "sentenceService",
    function($rootScope, $scope, localStorageService, currentUserService, currentCommentService, sentenceService) {

        $rootScope.pageClass = 'profile';
        $rootScope.sidebar = false;
        $rootScope.scoreNavbar = false;

        // get local storage new user
        $rootScope.localStorageNewUser = localStorageService.get("localStorageNewUser");
        $scope.$watch("localStorageNewUser", function(value) {
            localStorageService.set("localStorageNewUser", value);
            $scope.localStorageNewUserValue = localStorageService.get(
                "localStorageNewUser"
            );
        });

        // current user
        $scope.currentUser = currentUserService.get({
            username: $rootScope.localStorageNewUser
        });

        $scope.currentUser.$promise.then(function(res) {
            $scope.currentUserID = res._id;
            $scope.totalScore = res.totalScore;
            $scope.comments = res.comments;
            $scope.ratedOn = res.ratedOn;
            $scope.commentResults = [];
            $scope.rateResults = [];

            for (var i = 0; i < res.comments.length; i++) {
                // console.log(currentCommentService.get({id: res.comments[i]}))
                $scope.temp = currentCommentService.get({
                    id: res.comments[i]
                });
                $scope.temp.$promise.then(function(res) {
                    $scope.commentResults.push([
                        sentenceService.get({
                            id: res.commentedOn
                        }),
                        res.content,
                        res.commentScore,
                        res.rateScore
                    ]);
                });
            }

            // console.log($scope.commentResults);

            for (var i = 0; i < res.ratedOn.length; i++) {
                $scope.temp = currentCommentService.get({
                    id: res.ratedOn[i]
                });
                $scope.temp.$promise.then(function(res) {
                    for (var i = 0; i < res.rating.length; i++) {
                        if ($scope.currentUserID == res.rating[i].ratedBy) {
                            $scope.rateResults.push([
                                res.content,
                                res.rating[i].rate
                            ]);
                        }
                    }
                });
            }
        });

    }
]);

/* LEADERBOARD CONTROLLER */
gameApp.controller("leaderCtrl", ["$rootScope", "$scope", "localStorageService", "userService",
    function($rootScope, $scope, localStorageService, userService) {

        $rootScope.pageClass = 'leader';
        $rootScope.sidebar = false;
        $rootScope.scoreNavbar = false;

        // get local storage new user
        $rootScope.localStorageNewUser = localStorageService.get("localStorageNewUser");
        $scope.$watch("localStorageNewUser", function(value) {
            localStorageService.set("localStorageNewUser", value);
            $scope.localStorageNewUserValue = localStorageService.get(
                "localStorageNewUser"
            );
        });

        // fetch all users. Issues a GET to /users
        $rootScope.users = userService.query();
        $scope.users.$promise.then(function(res) {
            $scope.users = res;
        });

    }
]);

/* ABOUT CONTROLLER */
gameApp.controller("aboutCtrl", ["$rootScope", "localStorageService",
    function($rootScope, localStorageService) {

        $rootScope.pageClass = 'about';
        $rootScope.sidebar = false;
        $rootScope.scoreNavbar = false;

        // get local storage new user
        $rootScope.localStorageNewUser = localStorageService.get("localStorageNewUser");

    }
]);