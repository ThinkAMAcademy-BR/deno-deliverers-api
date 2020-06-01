import { HandlerFunc, Context } from "https://deno.land/x/abc@v1.0.0-rc2/mod.ts";
import db from '../config/db.ts';
import { ErrorHandler } from '../utils/middlewares.ts';

const database = db.getDatabase;
const deliverers = database.collection('deliverers');

interface Deliverer {
  _id: {
    $oid: string;
  };
  name: string;
  age: number;
  deliveryFee: number;
  vehicle: string;
}

export const createDeliverer: HandlerFunc = async (c: Context) => {
  try {
    if (c.request.headers.get("content-type") !== "application/json") {
      throw new ErrorHandler("Invalid body", 422);
    }
    const body = await (c.body());
    if (!Object.keys(body).length) {
      throw new ErrorHandler("Request body can not be empty!", 400);
    }
    const { name, deliveryFee, age, vehicle } = body;

    const insertedDeliverer = await deliverers.insertOne({
      name,
      age,
      deliveryFee,
      vehicle,
    });

    return c.json(insertedDeliverer, 201);
  } catch (error) {
    throw new ErrorHandler(error.message, error.status || 500);
  }
};

export const fetchAllDeliverers: HandlerFunc = async (c: Context) => {
    try {
      const fetchedDeliverers: Deliverer[] = await deliverers.find();
  
      if (fetchedDeliverers) {
        const list = fetchedDeliverers.length
          ? fetchedDeliverers.map((deliverer) => {
            const { _id: { $oid }, name, age, deliveryFee, vehicle } = deliverer;
            return { id: $oid, name, age, deliveryFee, vehicle };
          })
          : [];
        return c.json(list, 200);
      }
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
};

export const fetchOneDeliverer: HandlerFunc = async (c: Context) => {
    try {
      const { id } = c.params as { id: string };
  
      const fetchedDeliverer = await deliverers.findOne({ _id: { "$oid": id } });
  
      if (fetchedDeliverer) {
        const { _id: { $oid }, name, age, deliveryFee, vehicle } = fetchedDeliverer;
        return c.json({ id: $oid, name, age, deliveryFee, vehicle }, 200);
      }
  
      throw new ErrorHandler("Deliverer not found", 404);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
};

export const updateDeliverer: HandlerFunc = async (c: Context) => {
    try {
      const { id } = c.params as { id: string };
      if (c.request.headers.get("content-type") !== "application/json") {
        throw new ErrorHandler("Invalid body", 422);
      }
  
      const body = await (c.body()) as {
        name?: string;
        deliveryFee: string;
        age?: string;
        vehicle?: string;
      };
  
      if (!Object.keys(body).length) {
        throw new ErrorHandler("Request body can not be empty!", 400);
      }
  
      const fetchedDeliverer = await deliverers.findOne({ _id: { "$oid": id } });
  
      if (fetchedDeliverer) {
        const { matchedCount } = await deliverers.updateOne(
          { _id: { "$oid": id } },
          { $set: body },
        );
        if (matchedCount) {
          return c.string("Deliverer updated successfully!", 204);
        }
        return c.string("Unable to update deliverer");
      }
      throw new ErrorHandler("Deliverer not found", 404);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
};

export const deleteDeliverer: HandlerFunc = async (c: Context) => {
    try {
      const { id } = c.params as { id: string };
  
      const fetchedDeliverer = await deliverers.findOne({ _id: { "$oid": id } });
  
      if (fetchedDeliverer) {
        const deleteCount = await deliverers.deleteOne({ _id: { "$oid": id } });
        if (deleteCount) {
          return c.string("Deliverer deleted successfully!", 204);
        }
        throw new ErrorHandler("Unable to delete deliverer", 400);
      }
  
      throw new ErrorHandler("Deliverer not found", 404);
    } catch (error) {
      throw new ErrorHandler(error.message, error.status || 500);
    }
};
