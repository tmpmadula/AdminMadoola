module.exports = {
  client: {
    addTypename: true,
    includes: ["src/**/*.ts", "src/**/*.tsx"],
    name: "home",
    service: {
      localSchemaFile: "schema.graphql",
      name: "madoola",
    },
  },
};
