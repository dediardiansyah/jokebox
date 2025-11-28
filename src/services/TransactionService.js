const { getDataSource } = require("@/database");
const { Transaction } = require("@/entities");

class TransactionService {
  async getRepository() {
    const dataSource = await getDataSource();
    return dataSource.getRepository(Transaction);
  }

  /**
   * Get transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Promise<Transaction|null>}
   */
  async findById(id) {
    const repository = await this.getRepository();
    return repository.findOne({
      where: { id },
      relations: ["design"],
    });
  }

  /**
   * Get all transactions for a design
   * @param {string} designId - Design ID
   * @returns {Promise<Transaction[]>}
   */
  async findByDesign(designId) {
    const repository = await this.getRepository();
    return repository.find({
      where: { design_id: designId },
      relations: ["design"],
      order: { created_at: "DESC" },
    });
  }

  /**
   * Create new transaction
   * @param {Object} data - Transaction data
   * @returns {Promise<Transaction>}
   */
  async create(data) {
    const repository = await this.getRepository();
    const transaction = repository.create({
      ...data,
      status: data.status || "pending",
      is_active: true,
    });
    return repository.save(transaction);
  }

  /**
   * Update transaction
   * @param {string} id - Transaction ID
   * @param {Object} data - Updated data
   * @returns {Promise<Transaction|null>}
   */
  async update(id, data) {
    const repository = await this.getRepository();
    await repository.update(id, data);
    return this.findById(id);
  }

  /**
   * Update transaction status
   * @param {string} id - Transaction ID
   * @param {string} status - New status (pending, success, failed)
   * @returns {Promise<Transaction|null>}
   */
  async updateStatus(id, status) {
    return this.update(id, {
      status,
      settled_at: status !== "pending" ? new Date() : null,
    });
  }

  /**
   * Get transactions by status
   * @param {string} status - Transaction status
   * @returns {Promise<Transaction[]>}
   */
  async findByStatus(status) {
    const repository = await this.getRepository();
    return repository.find({
      where: { status },
      relations: ["design"],
      order: { created_at: "DESC" },
    });
  }
}

module.exports = new TransactionService();
