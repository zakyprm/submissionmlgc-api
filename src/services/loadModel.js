const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    try {
        return await tf.loadGraphModel(process.env.MODEL_URL);
    } catch (error) {
        console.error('Error loading model:', error);
        throw new Error('Failed to load model');
    }
}

module.exports = loadModel;