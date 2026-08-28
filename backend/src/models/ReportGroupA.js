const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class ReportGroupA extends Model {}

ReportGroupA.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  registration_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  math: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  physics: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  chemistry: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  }
}, {
  sequelize,
  modelName: 'ReportGroupA',
  tableName: 'report_group_a',
  timestamps: true,
  indexes: [
    {
      fields: ['total']
    },
    {
      fields: ['registration_number']
    },
    {
      fields: ['student_id'],
      unique: true
    }
  ]
});

module.exports = ReportGroupA;
