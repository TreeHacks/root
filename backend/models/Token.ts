import mongoose from "mongoose";
import { Model, Schema } from "mongoose";

interface IToken extends mongoose.Document {
  email: string;
  company_id?: number;
}

const tokenSchema: Schema = new mongoose.Schema({
  company_id: String,
  expires_at: Number,
});

const model: Model<IToken> = mongoose.model("Token", tokenSchema);
export { model as Token, IToken };
