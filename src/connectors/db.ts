import mysql, { Connection, MysqlError } from 'mysql';

import config from '../config/index';

const connection: Connection = mysql.createConnection({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME
});

export default connection;