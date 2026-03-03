export interface PropertyAgent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  createdAt: string;
  updatedAt: string;
}

export type CreatePropertyAgentDto = Pick<
  PropertyAgent,
  'firstName' | 'lastName' | 'email' | 'mobileNumber'
>;

export type UpdatePropertyAgentDto = Partial<CreatePropertyAgentDto>;
