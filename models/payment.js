'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.User, {
        foreignKey: 'user_id',
        sourceKey: 'id'
      })

      Payment.belongsTo(models.Product, {
        foreignKey: 'product_id',
        sourceKey: 'id'
      })
    }
  }
  Payment.init({
    user_id: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    transaction_id: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'payment',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'Payment',
  });
  return Payment;
};