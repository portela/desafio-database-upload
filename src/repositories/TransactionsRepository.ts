import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeArray = await this.find({
      where: { type: 'income' },
    });

    const income = incomeArray.reduce((total, t) => {
      return total + t.value;
    }, 0);

    const outcomeArray = await this.find({
      where: { type: 'outcome' },
    });

    const outcome = outcomeArray.reduce((total, t) => {
      return total + t.value;
    }, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
