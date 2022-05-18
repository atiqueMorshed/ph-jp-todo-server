import 'dotenv/config';
import express from 'express';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import cors from 'cors';

const app = express();

// Vars
const port = process.env.PORT || 5001;

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.umt6y.mongodb.net/?retryWrites=true&w=majority`;

// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('OK');
});

// Mongo API
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const taskCollection = client.db('whatTODO').collection('task');
    console.log('DATABSE CONNECTION SUCCESSFUL.');

    // Adds a new task.
    app.post('/api/addTask', async (req, res) => {
      const { name, description, email } = req.body?.task;
      if (!name || !description || !email) {
        return res.status(400).send({ message: 'All fields are required.' });
      }
      try {
        const result = await taskCollection.insertOne({
          name,
          description,
          email,
          completed: false,
          insertedAt: new Date(),
        });
        return res.status(200).send({ result });
      } catch (error) {
        res
          .status(503)
          .send({ message: error?.message || 'Failed to add task.' });
      }
    });
  } finally {
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
