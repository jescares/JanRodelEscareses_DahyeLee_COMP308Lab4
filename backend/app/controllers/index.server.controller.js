const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");
// Load iris training and testing data
const iris = require("../../iris.json");
const irisTesting = require("../../iris-testing.json");

exports.trainAndPredict = function (req, res) {
  // Convert/setup our data for TensorFlow.js

  // Tensor of features for training data (include only features, not the output)
  const trainingData = tf.tensor2d(
    iris.map((item) => [
      item.sepal_length,
      item.sepal_width,
      item.petal_length,
      item.petal_width,
    ])
  );

  // Tensor of output for training data
  // The values for species will be:
  // setosa:       1,0,0
  // virginica:    0,1,0
  // versicolor:   0,0,1
  const outputData = tf.tensor2d(
    iris.map((item) => [
      item.species === "setosa" ? 1 : 0,
      item.species === "virginica" ? 1 : 0,
      item.species === "versicolor" ? 1 : 0,
    ])
  );

  // Tensor of features for testing data
  const testingData = tf.tensor2d(
    irisTesting.map((item) => [
      item.sepal_length,
      item.sepal_width,
      item.petal_length,
      item.petal_width,
    ])
  );

  // Build neural network using a sequential model
  const model = tf.sequential();
  // Add the first layer with relu activation
  model.add(
    tf.layers.dense({
      inputShape: [4], // Four input features: sepal length, sepal width, petal length, petal width
      units: 8, // Experiment with the number of units
      activation: "relu",
    })
  );
  // Add another dense layer (optional, experiment with adding or removing layers)
  model.add(
    tf.layers.dense({
      units: 10, // Experiment with the number of units
      activation: "relu",
    })
  );
  // Add the output layer with softmax activation for multi-class classification
  model.add(
    tf.layers.dense({
      units: 3, // Three output units for three classes: setosa, virginica, versicolor
      activation: "softmax",
    })
  );
  // Compile the model
  model.compile({
    optimizer: tf.train.adam(0.06), // Experiment with different learning rates
    loss: "categoricalCrossentropy", // Use categoricalCrossentropy for multi-class classification
    metrics: ["accuracy"], // Include accuracy as a metric for evaluation
  });

  console.log(model.summary());

  // Train the model and predict the results for testing data
  async function run() {
    const startTime = Date.now();
    // Train the model
    await model.fit(trainingData, outputData, {
      epochs: 100,
      callbacks: {
        // List of callbacks to be called during training
        onEpochEnd: async (epoch, log) => {
          console.log(`Epoch ${epoch}: lossValue = ${log.loss}`);
          console.log("Elapsed time:", Date.now() - startTime);
        },
      },
    });

    // Predict results for testing data
    const results = model.predict(testingData);

    // Get the values from the tf.Tensor
    results.array().then((array) => {
      // Assuming array contains the softmax output
      const predictions = array.map((row) => {
        const highestProbIndex = row.findIndex(
          (val) => val === Math.max(...row)
        );
        switch (highestProbIndex) {
          case 0:
            return "setosa";
          case 1:
            return "virginica";
          case 2:
            return "versicolor";
          default:
            return "Unknown";
        }
      });

      // Sending the first three predictions
      const dataToSend = { predictions: predictions.slice(0, 1) };
      console.log(dataToSend.predictions);
      res.status(200).send(dataToSend.predictions);
    });
  }

  // Call the run function
  run();
};
