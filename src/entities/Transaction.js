const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Transaction",
  tableName: "transactions",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    design_id: {
      type: "uuid",
    },
    total: {
      type: "integer",
      default: 0,
    },
    description: {
      type: "text",
      nullable: true,
    },
    key: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    token: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    status: {
      type: "varchar",
      length: 50,
      default: "pending",
    },
    settled_at: {
      type: "timestamp",
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
    design: {
      type: "many-to-one",
      target: "CanvasDesign",
      joinColumn: {
        name: "design_id",
        referencedColumnName: "id",
      },
      inverseSide: "transactions",
    },
  },
});
