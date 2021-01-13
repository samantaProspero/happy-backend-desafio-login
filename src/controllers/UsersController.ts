import {Request, Response} from 'express';
import { getRepository } from 'typeorm';

import userView from '../views/users_view';
import * as Yup from 'yup';
import User from '../models/User';


export default {
  // async index(request: Request, response: Response){
    
  //   return response.send({ userId: request.userId});
  // },
  async index(request: Request, response: Response){
    
    const usersRepository = getRepository(User);
    const users = await usersRepository.find();
    return response.json({users});
  },
  async show(request: Request, response: Response){
    const {id} = request.params;

    const usersRepository = getRepository(User);
    const user = await usersRepository.findOneOrFail(id);

    return response.json(userView.render(user));
  },
  async create(request: Request, response: Response){
  
    const {
      name,
      email,
      password,
    } = request.body;
  
    const usersRepository = getRepository(User);

    const userExists = await usersRepository.findOne({ where: { email}})

    if(userExists){
      return response.sendStatus(409)
    }

    const data = {
      name,
      email,
      password,
    }
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required(),
    })

    await schema.validate(data, {
      abortEarly: false,
    });
  
    const user = usersRepository.create(data);
  
    await usersRepository.save(user);
  
    return response.status(201).json(user);
  }
}