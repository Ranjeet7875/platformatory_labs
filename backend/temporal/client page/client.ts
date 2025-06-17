// src/temporal/client.ts
import { Connection, Client } from '@temporalio/client';

const connection = await Connection.connect({
  address: 'localhost:7233',
});

const client = new Client({ connection });

export { client, connection };
