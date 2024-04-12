const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");
const iris = require("../../iris.json");
const irisTesting = require("../../iris-testing.json");

exports.trainAndPredict = async function (req, res) {
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
  const testingData = tf.tensor2d([
    [
      parseFloat(req.body.sepalLength),
      parseFloat(req.body.sepalWidth),
      parseFloat(req.body.petalLength),
      parseFloat(req.body.petalWidth),
    ],
  ]);

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

  // Train the model
  await model.fit(trainingData, outputData, {
    epochs: 100,
  });

  // Predict results for testing data
  const results = model.predict(testingData);

  // Get the values from the tf.Tensor
  const prediction = await results.argMax(1).data();

  // Determine the species based on the prediction
  let species;
  switch (prediction[0]) {
    case 0:
      species = "setosa";
      break;
    case 1:
      species = "virginica";
      break;
    case 2:
      species = "versicolor";
      break;
    default:
      species = "Unknown";
  }

  // Sending the prediction
  res.status(200).send(species);
};
