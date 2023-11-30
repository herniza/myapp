import express, { Request, Response, NextFunction } from 'express';

import userRoutes from './routes/users';
import config from './config/index';

const app = express();
const port = config.PORT;

app.use(express.json());
app.use('/user', userRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});