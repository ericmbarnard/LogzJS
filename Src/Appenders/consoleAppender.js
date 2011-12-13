(function (logzJS) {

    function ConsoleAppender() {
        var logToConsole = function (logEntry, loggerContext) {
            if (window.console) {
                var entry = [];
                entry.push(logEntry.logLevelName.toUpperCase() + ":");
                entry.push(logEntry.message || '');
                entry.push(logEntry.details || '');
                entry.push(logEntry.loggedAt.toDateString());
                console.log(entry.join(" "));
            }
        };

        //make the interface methods
        this.trace = logToConsole;
        this.debug = logToConsole;
        this.info = logToConsole;
        this.warn = logToConsole;
        this.error = logToConsole;
        this.fatal = logToConsole;
    };

    logzJS.appenders['ConsoleAppender'] = new ConsoleAppender();
} (window.logzJS));