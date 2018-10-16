const winston = require('winston');
require('express-async-errors'); // No es necesario guardarlo en una const 

module.exports = function(){
    winston.add(
        new winston.transports.File({ filename: 'logfile.log', handleExceptions: true })
    );

    winston.exceptions.handle( 
        new winston.transports.Console({ 
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.json()
            )
        }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' })
    );
    
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
}