const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Score = sequelize.define('Score', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  score_level: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  tableName: 'scores',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'subject_id']
    },
    {
      fields: ['subject_id', 'score_level']
    },
    {
      fields: ['student_id']
    }
  ]
});

module.exports = Score;
