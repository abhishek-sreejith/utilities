const mysql = require('mysql');

exports.handler = async (event, context) => {
    // RDS instance configuration
    const rdsHost = 'dbrds.cvc0gwaqgf8c.us-east-1.rds.amazonaws.com';
    const dbUsername = 'admin';
    const dbPassword = 'Abhishek321';
    const dbName = 'products';

    // Create connection pool
    const pool = mysql.createPool({
        connectionLimit: 10,
        host: rdsHost,
        user: dbUsername,
        password: dbPassword,
        database: dbName,
        multipleStatements: true,
    });

    // Get a connection from the pool
    const getConnection = () => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });
    };

    // Release connection back to the pool
    const releaseConnection = (connection) => {
        return new Promise((resolve, reject) => {
            connection.release();
            resolve();
        });
    };

    try {
        // Get a connection from the pool
        const connection = await getConnection();

        // Perform database operations
        //const query = 'SELECT * FROM productsTable;';
        //const query2 = 'INSERT INTO productsTable (productId, productName, category, brand, price, color, stock)VALUES (7, "Tablet", "Electronics", "Apple", 499.99, "Space Gray", 80);'
        const query = `
        INSERT INTO productsTable (productId, productName, category, brand, price, color, stock) VALUES (8, 'Running Short', 'Clothing', 'Adidas', 29.99, 'Black', 120);
        INSERT INTO productsTable (productId, productName, category, brand, price, color, stock) VALUES (9, 'Tablet', 'Electronics', 'Apple', 499.99, 'Space Gray', 80);
        SELECT * FROM productsTable;`;
        const result = await new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Release the connection back to the pool
        await releaseConnection(connection);

        console.log(result);
        return {
            statusCode: 200,
            body: result
        };
    } catch (error) {
        console.error('Error connecting to RDS:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error connecting to RDS' })
        };
    } finally {
        // End the pool when finished
        pool.end();
    }
};
