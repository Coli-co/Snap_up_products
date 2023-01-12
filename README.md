## Snap up product

### Introduction

> Race condition occurs when the same resource is read and written simultaneously. Intuitively, using mutex lock to avoid this case seems available, but it's easier to cause dead lock.

Take snap up for example, in order to avoid data competition, setting transaction to ensure that they are logically serializable. This project simulate multiple requests at the same time of snapping up a product, and achieve data consistency by setting transaction level of PostgreSQL.

### Structure

![This is an image](https://colicontainer.s3.ap-northeast-1.amazonaws.com/firstFolder/side+project+structure-fixed.jpg)

### Features

- Authenticate user by JWT token.
- Simulate the result of snapping up the same product by multiple snappers.
- Keep data consistency at the same time of snapping up.

### Simulation Result

![This is an video](https://colicontainer.s3.ap-northeast-1.amazonaws.com/firstFolder/snap-up-result-gif.gif)

You can visit here: [Link](https://snap-up-product.site)

### Test Account

**Email:** aaa@gmail.com
**Password:** aaa

### Tools

- Server: Node.js
- Framework: Express.js
- User authorization: JWT
- Template: Handlebars (parse HTML/CSS)
- JavaScript
- Bootstrap
- Database: AWS RDS + PostgreSQL
- Proxy server: Nginx

### AWS Cloud Services

- SQS
- Lambda
- EC2

### Developer

- [Timothy](https://github.com/Coli-co)
