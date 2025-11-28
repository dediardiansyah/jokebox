const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "CanvasDesign",
  tableName: "canvas_designs",
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
    data: {
      type: "jsonb",
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
    price: {
      type: "integer",
      default: 0,
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
    transactions: {
      type: "one-to-many",
      target: "Transaction",
      inverseSide: "design",
    },
    categories: {
      type: "many-to-many",
      target: "Category",
      joinTable: {
        name: "canvas_design_categories",
        joinColumn: {
          name: "design_id",
          referencedColumnName: "id",
        },
        inverseJoinColumn: {
          name: "category_id",
          referencedColumnName: "id",
        },
      },
      inverseSide: "designs",
    },
  },
});
