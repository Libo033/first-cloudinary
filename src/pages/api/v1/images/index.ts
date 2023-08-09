import clientPromise from "@/Libs/DataBase";
import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const client: MongoClient = await clientPromise;
    const db = client.db("Cloudinary-Practice");

    const allImages = await db.collection("Images").find({}).toArray();

    res.status(200).json(allImages);
  }
  if (req.method === "POST") {
    try {
      const client: MongoClient = await clientPromise;
      const db = client.db("Cloudinary-Practice");
  
      const newImage = {
        image: req.body.secure_url,
        created_at: req.body.created_at
      };
  
      const insetedImage = await db.collection("Images").insertOne(newImage);
  
      if (!insetedImage) {
        throw new Error("it cannot be save image in mongodb");
      }
  
      res.status(201).json({"Image": "saved succesfully"});
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }
}
