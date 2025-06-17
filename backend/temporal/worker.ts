// src/temporal/worker.ts
import { Worker } from '@temporalio/worker';
import * as activities from './activities.ts';

async function runWorker() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows/updateUserProfileWorkflow.js'),
    activities,
    taskQueue: 'user-profile-queue',
  });

  await worker.run();
}

runWorker().catch((err) => {
  console.error(err);
  process.exit(1);
});
