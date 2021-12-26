const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const admin = require('firebase-admin')

const port = 4000;



var serviceAccount = require("./room-book-dad1e-firebase-adminsdk-87r0v-01ae5fcf34.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const pass = 'arabianHorse1234'

const app = express()
app.use(cors())
app.use(bodyParser.json())

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://arabian:arabianHorse1234@cluster0.vfsjf.mongodb.net/roomBooking?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
client.connect(err => {
  const collection = client.db("roomBooking").collection("bookings");
  console.log('data is connected')
  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    collection.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    console.log(newBooking)
  })

  app.get('/bookings', (req, res) => {
    const bearer = req.headers.authorization
    if (bearer && bearer.startsWith('Bearer ')) {
      const idToken = bearer.split(' ')[1];
      console.log({ idToken })
      admin.auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          console.log(tokenEmail,queryEmail  )
          if (tokenEmail == queryEmail) {
            collection.find({ email: req.query.email })
              .toArray((err, documents) => {
                res.send(documents)
              })
          }

        })
        .catch((error) => {
        });
    }


  })
});


app.get('/', (req, res) => {
  res.send('Hello World! i am starting room booking')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})