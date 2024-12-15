import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      required: true,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['personal', 'home', 'work'],
      required: true,
      default: ['personal'],
    },
  },
  {
    timestamps: true,
    createdAt: Date.now,
    updatedAt: Date.now,
    versionKey: false,
  },
);

export const ContactCollection = model('contact', contactSchema);
