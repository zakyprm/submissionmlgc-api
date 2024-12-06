const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");
const { Firestore } = require("@google-cloud/firestore");
const { get } = require("http");

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { result, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: result,
    suggestion: suggestion,
    createdAt: createdAt,
  };
  console.log("Data ingin dikirim");
  await storeData(id, data);
  console.log("Data berhasil dikirim");

  const response = h.response({
    status: "success",
    message: "Model is predicted successfully",
    data,
  });

  response.code(201);
  return response;
}

async function getHistoriesHandler(request, h) {
  const db = new Firestore();
  const predictCollection = db.collection("predictions");
  const predictSnapshot = await predictCollection.get();

  const data = [];

  predictSnapshot.forEach((doc) => {
    const history = {
      id: doc.id,
      history: doc.data(),
    };
    data.push(history);
  });

  const response = h.response({
    status: "success",
    data: data,
  });
  response.code(200);
  return response;
}

module.exports = { postPredictHandler, getHistoriesHandler };