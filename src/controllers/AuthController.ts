import {Request, Response} from 'express';
import { getRepository } from 'typeorm';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';


export default {
  async authenticate(request: Request, response: Response){
    
    const usersRepository = getRepository(User);
    const {
      email,
      password,
    } = request.body;
  

    const user = await usersRepository.findOne({ where: { email }})

    if(!user){
      return response.sendStatus(401)
    }
    const isValidPassword = await bcrypt.compare(password, user.password)

    if(!isValidPassword){
      return response.sendStatus(401)
    }
    // Criar um outro secret, deixá-lo em .env e substituir na palavra secret abaixo 
    const token= jwt.sign({ id: user.id}, process.env.SECRET_TOKEN, {expiresIn: '1d'})
    

    // const schema = Yup.object().shape({
    //   email: Yup.string().required(),
    //   password: Yup.string().required(),
    // })

    // await schema.validate(data, {
    //   abortEarly: false,
    // });


    // para funcionar o delete user.password colocar falso no no tsconfig.json ===  "strictNullChecks": false
    delete user.password;
    return response.json({
      user,
      token,
    });
  }
}