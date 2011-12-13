/// <reference path="../../Lib/amplify.js" />


(function (logzJS) {
    logzJS.appenders['LocalStorageAppender'] = new function () {
        //set up the local storage array
        var storeKey = "__logzJS__";
        var myArr = [];
        amplify.store(storeKey, myArr);

        var logToLocaleStorage = function (logEntry, loggerContext) {
            var arr = amplify.store(storeKey);
            arr.push(logEntry);
            amplify.store(storeKey, arr);
        };

        //make the interface methods
        this.trace = logToLocaleStorage;
        this.debug = logToLocaleStorage;
        this.info = logToLocaleStorage;
        this.warn = logToLocaleStorage;
        this.error = logToLocaleStorage;
        this.fatal = logToLocaleStorage;

    };
}(window.logzJS));