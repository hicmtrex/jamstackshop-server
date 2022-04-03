const { parse } = require("pg-connection-string");

module.exports = ({ env }) => {
  const { database } = parse(env("DATABASE_URL"));
  const { host } = parse(env("PG_HOST"));
  const { password } = parse(env("PG_Password"));
  const { port } = parse(env("PG_PORT"));
  const { user } = parse(env("PG_USERNAME"));

  return {
    defaultConnection: "default",
    connections: {
      default: {
        connector: "bookshelf",
        settings: {
          client: "postgres",
          host,
          port,
          database,
          username: user,
          password,
          ssl: { rejectUnauthorized: false },
        },
        options: {
          ssl: false,
        },
      },
    },
  };
};
