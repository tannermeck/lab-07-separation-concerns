const Order = require('../models/Order');
const { sendSms } = require('../utils/twilio');

module.exports = class OrderService {
  //send a text and store the order

  static async createOrder({ quantity }) {
    //send text
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `New Order received for ${quantity}`
    );
    //store the order
    const order = await Order.insert({ quantity });
    return order;
  }

  static async getAllOrders(){
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      'All orders displayed'
    );
    const order = await Order.select();
    return order;
  }

  static async getOrderById(id) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order displayed for purchase ${id}`
    );
    const order = await Order.selectById(id);
    return order;
  }

  static async patchOrderById(id, quantity) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order quantity changed for purchase ${id} quantity: ${quantity}`
    );
    const order = await Order.changeById(id, quantity);
    return order;
  }

  static async deleteOrderById(id) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order ${id} deleted`
    );
    const order = await Order.deleteById(id);
    return order;
  }
};
