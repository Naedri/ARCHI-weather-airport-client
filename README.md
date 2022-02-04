# Aeroport simulation client

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It allows an user to view on a web interface data from a redis database fullfilled with sensors. More details about this project is available at the following page : [meteo_des_aeroports](https://github.com/Naedri/meteo_des_aeroports).

## Getting Started

First, add a _.env.local_ file , containing the address of the database server `NEXT_PUBLIC_API`.
For example : `NEXT_PUBLIC_API=http://localhost:8080`.

Then, run the client server:

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
