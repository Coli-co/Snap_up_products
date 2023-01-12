## Snap up product

### Introduction

> Race condition occurs when the same resource is read and written simultaneously. Intuitively, using mutex lock to avoid this case seems available, but it's easier to cause dead lock.

Take snap up for example, to avoid data competition, we can set isolation levels to ensure that they are logically serializable, this project simulate multiple request at the time of snapping up product, and achieve data consistency by setting transaction level of postgreSQL.

### Structure

![This is an image](https://colicontainer.s3.ap-northeast-1.amazonaws.com/firstFolder/side+project+structure.jpg)

### Features

- Authenticate user by JWT token.
- Simulate the result of snapping up the same product by multiple snapper.
- Keep data consistency at the time of snapping up.

### Simulation Result

![This is an video](https://colicontainer.s3.ap-northeast-1.amazonaws.com/firstFolder/snap-up-result-gif.gif)

### Test Account

**Email:** aaa@gmail.com
**Password:** aaa

You can visit here: [Link](https://snap-up-product.site)

### Tools

- Server: Node.js
- Framework: Express.js
- User authorization: JWT
- Template: Handlebars (parse HTML/CSS)
- JavaScript
- Bootstrap
- Database: AWS RDS + PostgreSQL

### AWS Cloud Services

- SQS
- Lambda
- EC2

### Developer

- [Timothy]('https://github.com/Coli-co')
