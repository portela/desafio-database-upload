import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transactionExist = await transactionRepository.findOne({
      where: { id },
    });

    if (!transactionExist) {
      throw new AppError('Transaction not found.');
    }

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
