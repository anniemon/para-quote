import mongoose, { Document, Schema } from 'mongoose';

export interface IQuote extends Document {
  text: string;
  author: string;
}

const QuoteSchema: Schema = new Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
});

export const Quote = mongoose.model<IQuote>('Quote', QuoteSchema);
