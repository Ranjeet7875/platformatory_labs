const axios = require("axios");
const User = require("../../models/User");

async function saveToDatabase(userId, updateData) {
  const updated = await User.findByIdAndUpdate(userId, updateData, { new: true });
  return updated;
}

async function updateToCrudCrud(data) {
  await new Promise((resolve) => setTimeout(resolve, 10000)); // 10s delay
  await axios.post("https://crudcrud.com/api/c6fccb8a4bd64e268294ed466d337224/users", data);
}

module.exports = { saveToDatabase, updateToCrudCrud };
