import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import agents from '../models/store';
import { PropertyAgent, CreatePropertyAgentDto, UpdatePropertyAgentDto } from '../models/PropertyAgent';
import { validateCreate, validateUpdate } from '../middleware/validate';

const router = Router();

function getIdParam(req: Request): string {
  return req.params.id as string;
}

// GET /agents — List all agents
router.get('/', (_req: Request, res: Response) => {
  const allAgents = Array.from(agents.values());
  res.json(allAgents);
});

// GET /agents/:id — Get a single agent
router.get('/:id', (req: Request, res: Response) => {
  const agent = agents.get(getIdParam(req));
  if (!agent) {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }
  res.json(agent);
});

// POST /agents — Create a new agent
router.post('/', validateCreate, (req: Request, res: Response) => {
  const dto = req.body as CreatePropertyAgentDto;

  // Stretch goal: check for duplicate email
  const duplicate = Array.from(agents.values()).find(
    (a) => a.email.toLowerCase() === dto.email.toLowerCase()
  );
  if (duplicate) {
    res.status(409).json({ error: 'An agent with this email already exists' });
    return;
  }

  const now = new Date().toISOString();
  const agent: PropertyAgent = {
    id: uuidv4(),
    firstName: dto.firstName.trim(),
    lastName: dto.lastName.trim(),
    email: dto.email.trim().toLowerCase(),
    mobileNumber: dto.mobileNumber.trim(),
    createdAt: now,
    updatedAt: now,
  };

  agents.set(agent.id, agent);
  res.status(201).json(agent);
});

// PUT /agents/:id — Update an agent (partial update)
router.put('/:id', validateUpdate, (req: Request, res: Response) => {
  const id = getIdParam(req);
  const existing = agents.get(id);
  if (!existing) {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }

  const dto = req.body as UpdatePropertyAgentDto;

  // Check email uniqueness if email is being changed
  if (dto.email && dto.email.toLowerCase() !== existing.email) {
    const duplicate = Array.from(agents.values()).find(
      (a) => a.email.toLowerCase() === dto.email!.toLowerCase() && a.id !== existing.id
    );
    if (duplicate) {
      res.status(409).json({ error: 'An agent with this email already exists' });
      return;
    }
  }

  const updated: PropertyAgent = {
    ...existing,
    firstName: dto.firstName?.trim() ?? existing.firstName,
    lastName: dto.lastName?.trim() ?? existing.lastName,
    email: dto.email?.trim().toLowerCase() ?? existing.email,
    mobileNumber: dto.mobileNumber?.trim() ?? existing.mobileNumber,
    updatedAt: new Date().toISOString(),
  };

  agents.set(updated.id, updated);
  res.json(updated);
});

// DELETE /agents/:id — Delete an agent
router.delete('/:id', (req: Request, res: Response) => {
  const id = getIdParam(req);
  if (!agents.has(id)) {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }
  agents.delete(id);
  res.status(204).send();
});

export default router;
