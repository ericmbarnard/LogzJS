/// <reference path="Qunit/qunit.js" />

module('basic Logger Tests');
test('logger instantiates', function () {
    var logger = logzJS.getLogger('myLogger');

    ok(logger, 'Logger exists');
    ok(logzJS.loggers['myLogger'], 'Logger Added to local cache');
});

window.testLogHistory = [];
window.clearLogHistory = function () {
    window.testLogHistory = [];
};
window.logzJS.appenders['testAppender'] = new function () {
    var logToHistory = function (logEntry, loggerContext) {
        if (window.console) {
            console.log(logEntry.toJson());
        }
        window.testLogHistory.push(logEntry);
    };

    var loggingMethods = ['trace', 'info', 'debug', 'warn', 'error', 'fatal'];
    for (var i = 0, len = loggingMethods.length; i < len; i++) {
        this[loggingMethods[i]] = logToHistory;
    }
};

module('Tracing Tests');
test('Basic Tracing', function () {
    clearLogHistory();
    logzJS.setLogLevel(60); // Tracing

    var logger = logzJS.getLogger('myLogger');
    logger.trace('Just Some Basic Tracing');

    ok(testLogHistory.length > 0, 'Tracing Log Entry Added');

});


module('Error Tests');
test('Basic Tracing', function () {

    clearLogHistory();
    logzJS.setLogLevel(50); // Errors and Fatals only

    var logger = logzJS.getLogger('myLogger');

    try {
        thisIsNotAFunction();
    } catch (err) {
        logger.error('Found an Error!', err);    
    }
    
    ok(testLogHistory.length > 0, 'Error Log Entry Added');
    
});