import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { MysqlError } from 'mysql';
import axios from 'axios';

import connection from '../connectors/db';

const userRoute = Router();

userRoute.get('/', (req: Request, res: Response) => {
  connection.query("SELECT * FROM users", (err: MysqlError | null, result: any) => {
    if (err) {
      console.error(err)

      res.status(500).end()

      return
    }

    res.status(200).json(result).end()
  });
})

userRoute.get('/fetch', async (req: Request, res: Response) => {
  if(!req.query.page){
    res.status(500).send('Params is not exist!');

    return
  }

  const { data: { data: fetchedUsers } } = await axios.get('https://reqres.in/api/users?page=' + req.query.page);

  connection.query(
    "INSERT INTO users (email, first_name, last_name, avatar, created_at, updated_at, deleted_at) VALUES ?", 
    [fetchedUsers.map((data: any) => [data.email, data.first_name, data.last_name, data.avatar, new Date(), null, null])],
    (err: MysqlError | null, result: any) => {
      if (err) {
        console.error(err)

        res.status(500).send('Email already exist in DB');

        return
      }

      res.status(200).json(fetchedUsers).end()
    }
  );
})

userRoute.get('/:id', (req: Request, res: Response) => {
  connection.query("SELECT * FROM users WHERE id = " + req.params.id, (err: MysqlError | null, result: any) => {
    if (err) {
      console.error(err)

      res.status(500).end()

      return
    }

    res.status(200).json(result).end()
  });
})

userRoute.post('/', (req: Request, res: Response) => {
  const { body: { email, first_name, last_name, avatar }} = req;
  
  connection.query(
    "INSERT INTO users (email, first_name, last_name, avatar, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?)", 
    [email, first_name, last_name, avatar, new Date(), null, null],
    (err: MysqlError | null, result: any) => {
      if (err) {
        console.error(err)

        res.status(500).send('Email already exist in DB');

        return
      }

      res.status(200).json(result).end()
    }
  );
})

userRoute.delete('/:id', (req: Request, res: Response) => {
  if(req.headers.authorization !== '3cdcnTiBsl'){
    res.status(403).send('Failed to authenticate')

    return
  }
  
  connection.query(
    "UPDATE users SET deleted_at = now() WHERE id = " + req.params.id,
    (err: MysqlError | null, result: any) => {
      if (err) {
        console.error(err)
  
        res.status(500).end()
  
        return
      }
  
      res.status(200).json(result).end()
    });
})

userRoute.put('/:id', (req: Request, res: Response) => {
  const payload = "first_name = '" + req.body.first_name + "', last_name = '" + req.body.last_name + "', avatar = '" + req.body.avatar + "', email = '" + req.body.email + "', updated_at = now()";
  
  connection.query(
    "UPDATE users SET " + payload + " WHERE id = " + req.params.id,
    (err: MysqlError | null, result: any) => {
      if (err) {
        console.error(err)

        res.status(500).send('Email already exist in DB');
  
        return
      }
  
      res.status(200).json(result).end()
    });
})

export default userRoute;