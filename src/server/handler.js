const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
 
async function postPredictHandler(request, h) {
  try {
      const { image } = request.payload;
      const { model } = request.server.app;

      const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();

      const data = {
          id,
          result: label,
          suggestion,
          createdAt,
      };

      await storeData(id, data);

      const response = h.response({
          status: 'success',
          message: confidenceScore > 99
              ? 'Model is predicted successfully.'
              : 'Model is predicted successfully but under threshold. Please use the correct picture.',
          data,
      });
      response.code(201);
      return response;
  } catch (error) {
      console.error('Error occurred:', error);

      // Tangkap error dan kembalikan status integer
      const response = h.response({
          status: 'fail',
          message: `Error occurred: ${error.message}`,
      });
      response.code(500); // Pastikan status code berupa integer
      return response;
  }
}
 
module.exports = postPredictHandler;