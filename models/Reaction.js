const { Schema, Types } = require('mongoose');

const ReactionSchema = new Schema(
    {
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
      },
      reactionBody: {
        type: String,
        required: true,
        maxLength: 280,
      },
      username: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
  //getter?
      },
    },
    {
      toJSON: {
          virtuals: true,
      },
      id: false,
    }
  );

  module.exports = ReactionSchema;