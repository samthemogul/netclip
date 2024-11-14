import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { ValidateError } from '../../../libs/handlers/error'

class Uservalidator {
  public async validate(req: Request, res: Response, next: NextFunction) {
    const userpayload = req.body
    try {
      const schema = Joi.object({
        email: Joi.string()
          .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
          .required(),
        firstname: Joi.string().min(3).max(50),
        lastname: Joi.string().min(3).max(50),
      })
      const { error } = schema.validate(userpayload)
      if (!error) {
        next()
      } else {
        const errorMessages = []
        for (const err of error.details) {
          errorMessages.push(err.message)
        }
        throw new ValidateError(errorMessages.join(','))
      }
    } catch (error: any) {
      next(error)
    }
  }
}

export default Uservalidator
