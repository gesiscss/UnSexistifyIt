// ROUTES

// inject route provider to my angular app
gameApp.config(["$routeProvider", "$locationProvider", "$httpProvider",
    function($routeProvider, $locationProvider, $httpProvider) {

        // $locationProvider.html5Mode(true);

        $routeProvider
            .when("/", {
                templateUrl: "pages/home.html",
                controller: "homeCtrl"
            })

            .when("/instruction", {
                templateUrl: "pages/instruction.html",
                controller: "instructionCtrl"
            })

            .when("/play", {
                templateUrl: "pages/play.html",
                controller: "playCtrl"
            })

            .when("/profile", {
                templateUrl: "pages/profile.html",
                controller: "profileCtrl"
            })

            .when("/leaderboard", {
                templateUrl: "pages/leaderboard.html",
                controller: "leaderCtrl"
            })

            .when("/about", {
                templateUrl: "pages/about.html",
                controller: "aboutCtrl"
            })

            .when("/forbidden", {
                templateUrl: "pages/forbidden.html",
                controller: "playCtrl"
            });

            // .otherwise({
            //     redirect: '/'
            // });

        $httpProvider.interceptors.push('httpRequestInterceptor');

        // no hash-prefix
        $locationProvider.hashPrefix("");
    }
]);
