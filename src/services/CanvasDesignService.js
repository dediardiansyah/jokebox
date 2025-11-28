const { getDataSource } = require("@/database");
const { CanvasDesign } = require("@/entities");

class CanvasDesignService {
  async getRepository() {
    const dataSource = await getDataSource();
    return dataSource.getRepository(CanvasDesign);
  }

  /**
   * Get all active canvas designs
   * @returns {Promise<CanvasDesign[]>}
   */
  async findAll() {
    const repository = await this.getRepository();
    return repository.find({
      where: { is_active: true },
      relations: ["categories"],
      order: { created_at: "DESC" },
    });
  }

  /**
   * Get canvas design by ID
   * @param {string} id - Design ID
   * @returns {Promise<CanvasDesign|null>}
   */
  async findById(id) {
    const repository = await this.getRepository();
    return repository.findOne({
      where: { id },
      relations: ["categories", "transactions"],
    });
  }

  /**
   * Create new canvas design
   * @param {Object} data - Design data
   * @returns {Promise<CanvasDesign>}
   */
  async create(data) {
    const repository = await this.getRepository();
    const design = repository.create({
      ...data,
      is_active: true,
    });
    return repository.save(design);
  }

  /**
   * Update canvas design
   * @param {string} id - Design ID
   * @param {Object} data - Updated data
   * @returns {Promise<CanvasDesign|null>}
   */
  async update(id, data) {
    const repository = await this.getRepository();
    await repository.update(id, data);
    return this.findById(id);
  }

  /**
   * Soft delete canvas design
   * @param {string} id - Design ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    const repository = await this.getRepository();
    await repository.update(id, { is_active: false });
  }

  /**
   * Get designs by category
   * @param {number} categoryId - Category ID
   * @returns {Promise<CanvasDesign[]>}
   */
  async findByCategory(categoryId) {
    const repository = await this.getRepository();
    return repository
      .createQueryBuilder("design")
      .leftJoinAndSelect("design.categories", "category")
      .where("category.id = :categoryId", { categoryId })
      .andWhere("design.is_active = :isActive", { isActive: true })
      .orderBy("design.created_at", "DESC")
      .getMany();
  }
}

module.exports = new CanvasDesignService();
