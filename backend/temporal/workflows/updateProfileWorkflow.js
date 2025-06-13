const { proxyActivities } = require("@temporalio/workflow");
const { defineSignal, setHandler } = require("@temporalio/workflow");

const activities = proxyActivities({
  startToCloseTimeout: "30 seconds",
});

async function updateProfileWorkflow({ userId, updateData }) {
  const savedUser = await activities.saveToDatabase(userId, updateData);
  await activities.updateToCrudCrud(savedUser);
  return savedUser;
}

module.exports = { updateProfileWorkflow };
