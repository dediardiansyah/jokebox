const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Category",
  tableName: "categories",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    name: {
      type: "varchar",
      length: 255,
    },
    description: {
      type: "text",
      nullable: true,
    },
    image_url: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    is_active: {
      type: "boolean",
      default: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    designs: {
      type: "many-to-many",
      target: "CanvasDesign",
      inverseSide: "categories",
    },
  },
});
