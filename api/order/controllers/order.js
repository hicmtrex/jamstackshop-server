"use strict";
const { sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const { user } = ctx.state;
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.order.search({
        ...ctx.query,
        user: user.id,
      });
    } else {
      entities = await strapi.services.order.find({
        ...ctx.query,
        user: user.id,
      });
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.order })
    );
  },
  async confirm(ctx) {
    const { checkout_session } = ctx.request.body;
    console.log("checkout_session", checkout_session);
    const session = await stripe.checkout.sessions.retrieve(checkout_session);
    console.log("verify session", session);

    if (session.payment_status === "paid") {
      //Update order
      const newOrder = await strapi.services.order.update(
        {
          checkout_session,
        },
        {
          status: "paid",
        }
      );

      return newOrder;
    } else {
      ctx.throw(
        400,
        "It seems like the order wasn't verified, please contact support"
      );
    }
  },
};
