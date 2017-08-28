/**
 * Abstracts CRUD operations with the database,
 * to allow easier implementation of the pattern
 */
export default class Repository {
  /**
   * Initialize the Repository 
   * @constructor
   * @param {object} db The knex instance
   * @param {string} table The name of the SQL table
   * @param {function} constructor The constructor for the associated model
   * @param {function} [dataToPersist=data => data]
   * Tells which data should be persisted in database for a given object
   * @param {function} [formatDataForConstructor=data => data]
   * Change data format from database to constructor (ie. start_date -> startDate)
   */
  constructor(
    db,
    table,
    constructor,
    dataToPersist = data => data,
    formatDataForConstructor = data => data,
  ) {
    this.db = db;
    this.table = table;
    this.constructor = constructor;
    this.dataToPersist = dataToPersist;
    this.formatDataForConstructor = formatDataForConstructor;
  }

  /**
   * Loads an entity from the given id
   * @param {int} id The object's id
   * @returns {object} The corresponding entity
   */
  async load(id) {
    return this.db(this.table).where({ id })
      .select()
      .then(data => new this.constructor(this.formatDataForConstructor(data[0])));
  }

  /**
   * Lists the entities
   * @param {object} whereClause Conditions (optionnal)
   * @returns {array} A list of entities
   */
  async list(whereClause = {}) {
    return this.db(this.table).select().where(whereClause)
      .then(datas => datas.map(data => new this.constructor(this.formatDataForConstructor(data))));
  }

  /**
   * Persists a new entity in database
   * @param {object} object The entity to persist
   * @returns {object} An entity, with a database generated id
   */
  async create(object) {
    return this.db(this.table).returning('id')
      .insert(this.dataToPersist(object))
      .then((id) => {
        const objectWithId = object;
        objectWithId.id = id[0];
        return objectWithId;
      });
  }

  /**
   * Updates an enitity in database
   * @param {object} object The entity to persist in database
   * @returns {boolean} True if the operation was a success
   */
  async update(object) {
    return this.db(this.table).where({ id: object.id })
      .update(this.dataToPersist(object))
      .then(() => true);
  }

  /**
   * Deletes an entity from database
   * @param {number} id The entity's id
   * @returns {boolean} True if the operation was a success
   */
  async delete(id) {
    return this.db(this.table).where({ id })
      .del()
      .then(() => true);
  }
}
