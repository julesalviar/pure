import { Request, Response, NextFunction } from 'express';
import { CreatePropertyAgentDto, UpdatePropertyAgentDto } from '../models/PropertyAgent';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

interface ValidationError {
  field: string;
  message: string;
}

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

function validatePhone(phone: string): boolean {
  return PHONE_REGEX.test(phone);
}

export function validateCreate(req: Request, res: Response, next: NextFunction): void {
  const body = req.body as Partial<CreatePropertyAgentDto>;
  const errors: ValidationError[] = [];

  if (!body.firstName || body.firstName.trim().length === 0) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }
  if (!body.lastName || body.lastName.trim().length === 0) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }
  if (!body.email || body.email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(body.email)) {
    errors.push({ field: 'email', message: 'Email format is invalid' });
  }
  if (!body.mobileNumber || body.mobileNumber.trim().length === 0) {
    errors.push({ field: 'mobileNumber', message: 'Mobile number is required' });
  } else if (!validatePhone(body.mobileNumber)) {
    errors.push({ field: 'mobileNumber', message: 'Mobile number format is invalid' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}

export function validateUpdate(req: Request, res: Response, next: NextFunction): void {
  const body = req.body as UpdatePropertyAgentDto;
  const errors: ValidationError[] = [];

  if (Object.keys(body).length === 0) {
    errors.push({ field: 'body', message: 'At least one field must be provided for update' });
  }

  if (body.firstName !== undefined && body.firstName.trim().length === 0) {
    errors.push({ field: 'firstName', message: 'First name cannot be empty' });
  }
  if (body.lastName !== undefined && body.lastName.trim().length === 0) {
    errors.push({ field: 'lastName', message: 'Last name cannot be empty' });
  }
  if (body.email !== undefined) {
    if (body.email.trim().length === 0) {
      errors.push({ field: 'email', message: 'Email cannot be empty' });
    } else if (!validateEmail(body.email)) {
      errors.push({ field: 'email', message: 'Email format is invalid' });
    }
  }
  if (body.mobileNumber !== undefined) {
    if (body.mobileNumber.trim().length === 0) {
      errors.push({ field: 'mobileNumber', message: 'Mobile number cannot be empty' });
    } else if (!validatePhone(body.mobileNumber)) {
      errors.push({ field: 'mobileNumber', message: 'Mobile number format is invalid' });
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
