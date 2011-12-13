
(function (logzJS) {

    var loggers = {}, // logger cache
        appenders = {}, // appender cache
        logLevels = {
            TRACE: 60,
            DEBUG: 50,
            INFO: 40,
            WARN: 30,
            ERROR: 20,
            FATAL: 10
        },

        _logLevel = 60, // global logLevel which determines if appenders receive Log Entries!

        utils = {
            getLoggedAt: function () {
                return new Date();
            },
            buildLogEntry: function (logger, logEntryOptions) {
                var entry = new LogEntry(logEntryOptions);
                entry.url = logger.url;
                entry.logLevelName = utils.getLogLevelNameFromCode(entry.logLevel);
                entry.scriptFile = logger.scriptFile;
                entry.logger = logger.name;
                return entry;
            },
            buildOptionsFromArgs: function (args) {
                var msg = '', details = '';

                if (args.length === 1) {
                    if (typeof (args[0]) === 'string') {
                        msg = args[0];
                    } else {
                        details = JSON.stringify(args[0]);
                    }
                } else if (args.length === 2) {
                    msg = args[0];
                    details = JSON.stringify(args[1]);
                } else {
                    msg = args[0];
                    details = JSON.stringify(args.slice(1));
                }

                return {
                    message: msg,
                    details: details
                };
            },
            getLogLevelNameFromCode: function (logLevel) {
                var levelName;
                utils.eachIn(logLevels, function (item, name) {
                    if (item === logLevel) {
                        levelName = name;
                    }
                });
                return levelName;
            },
            each: function (arr, callBack) {
                for (i = 0, len = arr.length; i < len; i++) {
                    callBack(arr[i], i);
                }
            },
            eachIn: function (obj, callBack) {
                var prop;
                for (prop in obj) {
                    callBack(obj[prop], prop);
                }
            }
        };

    function Logger(options) {
        var settings = {

        };

        this.name = options.name || '';
        this.url = document.location.toString();
        this.scriptFile = options.scriptFile || 'n/a';
    };



    Logger.prototype = {

        trace: function (msg, obj) {
            var options = utils.buildOptionsFromArgs(arguments);
            options.logLevel = logLevels.TRACE;
            this.addLogEntry(utils.buildLogEntry(this, options));
        },
        debug: function (obj) {
            var options = utils.buildOptionsFromArgs(arguments);
            options.logLevel = logLevels.DEBUG;
            this.addLogEntry(utils.buildLogEntry(this, options));
        },
        info: function (msg, obj) {
            var options = utils.buildOptionsFromArgs(arguments);
            options.logLevel = logLevels.INFO;
            this.addLogEntry(utils.buildLogEntry(this, options));
        },
        warn: function (msg, obj) {
            var options = utils.buildOptionsFromArgs(arguments);
            options.logLevel = logLevels.WARN;
            this.addLogEntry(utils.buildLogEntry(this, options));
        },
        error: function (msg, exc) {
            var options = utils.buildOptionsFromArgs(arguments);
            options.logLevel = logLevels.ERROR;
            this.addLogEntry(utils.buildLogEntry(this, options));
        },
        fatal: function (msg, exc) {
            var options = utils.buildOptionsFromArgs(arguments);
            options.logLevel = logLevels.FATAL;
            this.addLogEntry(utils.buildLogEntry(this, options));
        },

        addLogEntry: function (logEntry) {
            var appender;

            var tryFireAppenderAction = function (action, appndr, entry) {
                if (appndr[action] && _logLevel >= entry.logLevel) {
                    appndr[action](entry);
                }
            };

            utils.eachIn(appenders, function (appender) {
                switch (logEntry.logLevel) {
                    case logLevels.TRACE:
                        tryFireAppenderAction('trace', appender, logEntry);
                        break;
                    case logLevels.DEBUG:
                        tryFireAppenderAction('debug', appender, logEntry);
                        break;
                    case logLevels.INFO:
                        tryFireAppenderAction('info', appender, logEntry);
                        break;
                    case logLevels.WARN:
                        tryFireAppenderAction('warn', appender, logEntry);
                        break;
                    case logLevels.ERROR:
                        tryFireAppenderAction('error', appender, logEntry);
                        break;
                    case logLevels.FATAL:
                        tryFireAppenderAction('fatal', appender, logEntry);
                        break;
                };
            });
        }
    };

    function LogEntry(entryOpts) {
        this.details = entryOpts.details || null;
        this.logLevel = entryOpts.logLevel || 0;
        this.logLevelName = entryOpts.levelName || '';
        this.lineNumber = entryOpts.lineNumber || 0;
        this.loggedAt = utils.getLoggedAt();
        this.message = entryOpts.message || '';
        this.logger = entryOpts.loggerName || '';
        this.scriptFile = entryOpts.scriptFile || '';
        this.url = entryOpts.url || '';
    };

    LogEntry.prototype = {
        toJson: function () {
            return JSON.stringify(this);
        }
    };

    logzJS.getLogger = function (loggerName) {
        var logger = loggers[loggerName];
        if (!logger) {
            logger = new Logger({
                name: loggerName
            });
            loggers[loggerName] = logger;
        }

        return logger;
    };


    //#region logzJS global functions

    logzJS.getLogLevel = function () {
        return _logLevel;
    };

    logzJS.setLogLevel = function (logLevel) {
        _logLevel = logLevel;
    };

    logzJS.appenders = appenders;
    logzJS.loggers = loggers;


    //#endregion
} (window.logzJS = window.logzJS || {}));