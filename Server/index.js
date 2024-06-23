import express from 'express';
import cors from 'cors';
import { adminRouter } from './Routes/AdminRoute.js';
import { registerRouter } from './Routes/RegisterRoute.js';
import { taskRouter } from './Routes/taskRouter.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));


app.use(express.json());
app.use('/auth', adminRouter);
app.use('/auth', registerRouter);
app.use('/auth', taskRouter);


app.listen(3000, () => {
    console.log("Server is running");
});









// import express from 'express'
// import cors from 'cors'
// import { adminRouter } from './Routes/AdminRoute.js';



// const app = express()
// app.use(cors({
//     origin: ["http://localhost:5173/"],
//     methods: ['GET', 'POST', 'PUT'],
//     credentials: true
// }));
// app.use(express.json())
// app.use('/auth', adminRouter)

// app.listen(3000, () => {
//     console.log("Server is running");
// });
 