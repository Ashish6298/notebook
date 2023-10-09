import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb+srv://ashish:goswami@cluster0.trds1g8.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected successfully");
  })

  .catch((err) => {
    console.log(err);
  });

const noteSchema = mongoose.Schema({
  title: String,
  description: String,
});

const note = new mongoose.model("note", noteSchema);

app.get("/api/getAll", (req, res) => {
  note.find({}, (err, notesList) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send(notesList);
    }
  });
});

app.post("/api/addNew", (req, res) => {
  const { title, description } = req.body;
  const noteObj = new note({
    title,
    description,
  });
  noteObj.save((err) => {
    if (err) {
      console.log(err);
    }
    note.find({}, (err, notesList) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(notesList);
      }
    });
  });
});

app.post("/api/delete", (req, res) => {
  const { id } = req.body;
  note.deleteOne({ _id: id }, () => {
    note.find({}, (err, notesList) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(notesList);
      }
    });
  });
});

app.listen(4000, () => {
  console.log("Listening at port 4000");
});
