// Importing surprise libraries
import { Reader, Dataset, KNNBasic } from 'surprise.js';

// Load data into a Surprise dataset
// In this example, the data is a csv file with user_id, movie_id, rating columns
const reader = new Reader({ line: '\n', ratingScale: [1, 5] });
const data = new Dataset.load('data.csv', { reader });

// Split data into training and testing sets
const { trainingSet, testSet } = data.split(0.2);

// Define the collaborative filtering model
const simOptions = {
  name: 'cosine',
  user_based: true
};

const model = new KNNBasic({ sim_options: simOptions });

// Train the model on the training set
model.fit(trainingSet);

// Test the model on the testing set
const predictions = model.test(testSet);

// Get the top-k recommendations for a user
const userId = '1234';
const k = 10;
const userItems = trainingSet.ur[trainingSet.uidToIndex[userId]];
const allItems = trainingSet.iids;
const unseenItems = new Set(allItems.filter(item => !userItems.includes(item)));
const topK = model.getNeighbors(trainingSet.uidToIndex[userId], k);
const topItems = topK.map(i => trainingSet.indexToUid[i]);
const recommendations = topItems.filter(item => unseenItems.has(item)).slice(0, k);

console.log(recommendations);
