'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User, {
        foreignKey: 'user_id',
        sourceKey: 'id'
      })

      Cart.belongsTo(models.Product, {
        foreignKey: 'product_id',
        sourceKey: 'id'
      })
    }
  }
  Cart.init({
    quantity: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'cart',
    createdAt: 'created_at',
    updatedAt:'updated_at'
  });
  return Cart;
};