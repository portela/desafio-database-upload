import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import AppError from '../errors/AppError';

interface CSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filepath: string): Promise<Transaction[]> {
    // https://www.notion.so/Importando-arquivos-CSV-com-Node-js-2172338480cb47e28a5d3ed9981c38a0
    const readCSVStream = fs.createReadStream(filepath, 'utf8');

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);
    const csvTransactions: CSVTransaction[] = [];
    parseCSV.on('data', line =>
      csvTransactions.push({
        title: line[0],
        type: line[1],
        value: Number(line[2]),
        category: line[3],
      }),
    );

    await new Promise(resolve => parseCSV.on('end', resolve));

    console.log(csvTransactions);

    const createTransactionService = new CreateTransactionService();

    /*
    const transactions = Transaction[];

    const transaction = await createTransactionService.execute({
      title,
      value,
      type,
      category,
    });

    transactions.push(transaction)

    return transactions;
    */
  }
}

export default ImportTransactionsService;
