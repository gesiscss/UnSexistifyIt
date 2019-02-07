// DIRECTIVES


// USERNAME VALIDATOR
gameApp.directive("usernameValidation", function() {
    return {
        restrict: "A", // only activate on element attribute
        require: "?ngModel", // get a hold of NgModelController
        link: function(rootScope, element, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            var isConflict = function(value) {
                var conflict = false;
                angular.forEach(rootScope.users, function(user) {
                    // console.log(value, user.username);
                    if (user.username === value) {
                        conflict = true;
                        // console.log('conflict');
                    }
                });
                return conflict;
            };

            var validator = function(value) {
                ngModel.$setValidity("conflict", !isConflict(value));
                return value;
            };

            ngModel.$parsers.push(validator);
        }
    };
});


// UPPERCASE
gameApp.directive("uppercased", function() {
    return {
        require: "ngModel",
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(input) {
                return input ? input.toUpperCase() : "";
            });
            element.css("text-transform", "uppercase");
        }
    };
});


// PREVENT ENTER BUTTON
gameApp.directive('preventEnterSubmit', function() {
    return function(scope, el, attrs) {
        el.bind('keydown', function(event) {
            if (13 == event.which) {
                alert('"Enter" key has been disabled!');
                event.preventDefault(); // Doesn't work at all
                window.stop(); // Works in all browsers but IE...
                document.execCommand('Stop'); // Works in IE
                return false; // Don't even know why it's here. Does nothing.
            }
        });
    };
});


// COMPARE PASSWORD
gameApp.directive("compareTo", function() {
    return {
        require: "ngModel",
        scope: {
            repeatPassword: "=compareTo"
        },
        link: function(scope, element, attributes, paramval) {
            paramval.$validators.compareTo = function(val) {
                return val == scope.repeatPassword;
            };
            scope.$watch("confirmPassword", function() {
                paramval.$validate();
            });
        }
    };
});


// HIGHLIGHT WORDS
gameApp.directive('highlight', function(genderWordsListService, negativeWordsListService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        replace: false,
        link: function(scope, element, attrs, ngModel) {
            if (!attrs.highlightClass) {
                attrs.highlightClass = 'highlight-gender-words';
            }

            var replacer = function(match, item) {
                // if (negativeWordsListService.includes(match.toUpperCase())) {
                if (negativeWordsListService.indexOf(match.toUpperCase()) !== -1) {
                    attrs.highlightClass = 'highlight-not';
                } else {
                    attrs.highlightClass = 'highlight-gender-words';
                }
                return '<span class="' + attrs.highlightClass + '">' + match + '</span>';
            }

            var myKeywords = [];
            for (i = 0, len = genderWordsListService.length; i < len; i++) {
                myKeywords.push("\\b" + genderWordsListService[i] + "\\b");
            }
            for (i = 0, len = negativeWordsListService.length; i < len; i++) {
                myKeywords.push("\\b" + negativeWordsListService[i] + "\\b");
            }

            scope.$watch(attrs.ngModel, function(value) {
                if (value) {
                    if (!genderWordsListService || genderWordsListService == '') {
                        element.html(value);
                        return false;
                    }
                    if (!negativeWordsListService || negativeWordsListService == '') {
                        element.html(value);
                        return false;
                    }

                    var regex = new RegExp(myKeywords.join('|'), 'gmi');

                    var html = value.replace(regex, replacer);

                    element.html(html);
                }
            });
        }
    }
});

