import { Router } from 'express';
import { expenseController } from './expense.controller';
import { authenticate, requireRole } from '../../middleware/authMiddleware';
import { validate } from '../../middleware/validate';
import { verifyExpenseSchema } from './expense.schema';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate as any);
router.use(requireRole(Role.ADMIN, Role.SUPER_ADMIN) as any);

// GET /api/v1/expenses?tripId=&driverId=&verified=
router.get('/', expenseController.listExpenses as any);

// PATCH /api/v1/expenses/:id/verify
router.patch('/:id/verify', validate(verifyExpenseSchema) as any, expenseController.verifyExpense as any);

// GET /api/v1/expenses/trip/:tripId/summary
router.get('/trip/:tripId/summary', expenseController.getExpenseSummary as any);

export default router;
