const { Worker } = require("@temporalio/worker");
const path = require("path");

async function runWorker() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("./workflows/updateProfileWorkflow"),
    activities: require("./activities/userActivities"),
    taskQueue: "profile-update",
  });

  await worker.run();
}

runWorker().catch((err) => {
  console.error(err);
  process.exit(1);
});
