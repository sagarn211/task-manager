const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
},{ timestamps: true });

blacklistTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 31 });

module.exports = mongoose.model('blacklistToken', blacklistTokenSchema);
