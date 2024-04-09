let config = {
    databasedev() {
        return {
            host: 'localhost',
            user: 'marquesita',
            password: ']PzEUh*(a.vu4CNYñ',
            database: 'marquesita',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        }
    },
    databaseprod() {
        return {
             host: 'localhost',
            user: 'marquesita',
            password: ']PzEUh*(a.vu4CNYñ',
            database: 'marquesita',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        }
    },
    env: 'local',
    getUri(opt) {
        switch(opt) {
            case 'local':
                return 'http://localhost:5000';
            case 'test':
                return '';
            case 'prod':
                return '';
        }
    }
}

module.exports = config;
