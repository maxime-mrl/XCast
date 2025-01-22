import mongoose, { Document } from "mongoose";
import errorsHandler from "@middleware/modelsMiddleware/errorsHandler.middleware";

const userPreferencesSchema = new mongoose.Schema(
  {
    forecastSettings: new mongoose.Schema(
      {
        model: { type: String },
        selected: { type: String },
        level: { type: Number },
        maxHeight: { type: Number },
        position: { type: Object || false },
      },
      { _id: false }
    ),
    units: {
      type: Map,
      of: new mongoose.Schema(
        {
          selected: { type: String, required: true },
        },
        { _id: false }
      ),
      default: new Map(),
    },
    sync: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    mail: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
    },
    password: {
      type: String,
      required: true,
    },
    settings: {
      type: userPreferencesSchema,
      required: true,
    },
    socketIds: [String],
  },
  { timestamps: true }
);

// customize error thrown by mongoose
userSchema.post(/update|save/i, errorsHandler);

export interface User extends Document {
  mail: string;
  username: string;
  password: string;
  settings: {
    forecastSettings?: {
      model?: string;
      selected?: string;
      level?: number;
      maxHeight?: number;
      position?: Object | false;
    };
    units: Map<string, { selected: string }>;
    sync: boolean;
  };
  socketIds: string[];
}

export default mongoose.model("Users", userSchema);
