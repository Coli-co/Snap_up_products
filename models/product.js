const pool = require('../config/pg')

const query = `CREATE TABLE products (
  id SERIAL ,
	productname VARCHAR(60) NOT NULL,
	description VARCHAR(330) NOT NULL,
	feature VARCHAR(240) NOT NULL,
	originprice integer NOT NULL,
	sellprice integer NOT NULL,
	img VARCHAR(100) NOT NULL,
	quantity integer NOT NULL,
  PRIMARY KEY (id)
);`

pool
  .query(query)
  .then((res) => {
    console.log('Table is successfully created.')
  })
  .catch((err) => console.log(err))
  .finally(() => {
    pool.end()
  })
