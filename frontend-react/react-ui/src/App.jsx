import React, { useState } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    sepalLength: '',
    sepalWidth: '',
    petalLength: '',
    petalWidth: '',
    epochs: 100,
    learningRate: 0.01
  });
  const [prediction, setPrediction] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const apiUrl = "/api/run";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    try {
      const response = await axios.post(apiUrl, formData);
      setPrediction(response.data);
      setShowLoading(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setShowLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Enter the data to predict</h1>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="sepalLength">Sepal Length</label></td>
              <td>
                <input
                  type="number"
                  id="sepalLength"
                  name="sepalLength"
                  value={formData.sepalLength}
                  onChange={handleInputChange}
                  placeholder="Sepal Length"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="sepalWidth">Sepal Width</label></td>
              <td>
                <input
                  type="number"
                  id="sepalWidth"
                  name="sepalWidth"
                  value={formData.sepalWidth}
                  onChange={handleInputChange}
                  placeholder="Sepal Width"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="petalLength">Petal Length</label></td>
              <td>
                <input
                  type="number"
                  id="petalLength"
                  name="petalLength"
                  value={formData.petalLength}
                  onChange={handleInputChange}
                  placeholder="Petal Length"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="petalWidth">Petal Width</label></td>
              <td>
                <input
                  type="number"
                  id="petalWidth"
                  name="petalWidth"
                  value={formData.petalWidth}
                  onChange={handleInputChange}
                  placeholder="Petal Width"
                  required
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="epochs">Number of Epochs</label></td>
              <td>
                <input
                  type="number"
                  id="epochs"
                  name="epochs"
                  value={formData.epochs}
                  onChange={handleInputChange}
                  placeholder="Number of Epochs"
                />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="learningRate">Learning Rate</label></td>
              <td>
                <input
                  type="number"
                  step="0.01"
                  id="learningRate"
                  name="learningRate"
                  value={formData.learningRate}
                  onChange={handleInputChange}
                  placeholder="Learning Rate"
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button type="submit">Predict</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      {showLoading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}

      {prediction && (
        <div>
          <h1>Prediction Result</h1>
          <p>The predicted species of flower is: {prediction}</p>
        </div>
      )}
    </div>
  );
}

export default App;
