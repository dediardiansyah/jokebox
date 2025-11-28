const { getDataSource } = require("@/database");
const { Category } = require("@/entities");

class CategoryService {
  async getRepository() {
    const dataSource = await getDataSource();
    return dataSource.getRepository(Category);
  }

  /**
   * Get all active categories
   * @returns {Promise<Category[]>}
   */
  async findAll() {
    const repository = await this.getRepository();
    return repository.find({
      where: { is_active: true },
      relations: ["designs"],
      order: { name: "ASC" },
    });
  }

  /**
   * Get category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Category|null>}
   */
  async findById(id) {
    const repository = await this.getRepository();
    return repository.findOne({
      where: { id },
      relations: ["designs"],
    });
  }

  /**
   * Create new category
   * @param {Object} data - Category data
   * @returns {Promise<Category>}
   */
  async create(data) {
    const repository = await this.getRepository();
    const category = repository.create({
      ...data,
      is_active: true,
    });
    return repository.save(category);
  }

  /**
   * Update category
   * @param {number} id - Category ID
   * @param {Object} data - Updated data
   * @returns {Promise<Category|null>}
   */
  async update(id, data) {
    const repository = await this.getRepository();
    await repository.update(id, data);
    return this.findById(id);
  }

  /**
   * Soft delete category
   * @param {number} id - Category ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    const repository = await this.getRepository();
    await repository.update(id, { is_active: false });
  }
}

module.exports = new CategoryService();
