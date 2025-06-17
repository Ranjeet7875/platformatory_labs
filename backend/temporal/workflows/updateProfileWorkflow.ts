// src/temporal/workflows/updateUserProfileWorkflow.ts
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities.ts';

const { updateUserAndNotifyCrudCrud } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',
});

// Input type should match what the activity expects
interface UpdateUserInput {
  googleId: string;
  phoneNumber: string;
  city: string;
  pincode: string;
}

export async function updateUserProfileWorkflow(data: UpdateUserInput): Promise<void> {
  await updateUserAndNotifyCrudCrud(data);
}
