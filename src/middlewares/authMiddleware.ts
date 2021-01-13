import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload{
  id: string;
  iat: number;
  exp: number;
}

export default function authMiddleware(request: Request, response: Response, next:NextFunction){
  // console.log("request", request.rawHeaders[4])
  // console.log("request", request.headers.authorization)
  const { authorization } = request.headers;

  if(!authorization){
    return response.sendStatus(401);
  }
  const token = authorization.replace('Bearer','').trim()

  try{
    const data = jwt.verify(token, process.env.SECRET_TOKEN)
    const {id} = data as TokenPayload;
    request.userId = id;
    return next();

  } catch{
    return response.sendStatus(401);
  }
}