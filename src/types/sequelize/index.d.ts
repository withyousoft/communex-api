import sequelize from 'sequelize'
import {
  BulkCreateOptions,
  CreateOptions,
  DestroyOptions,
  DropOptions,
  FindOptions,
  InstanceDestroyOptions,
  Logging,
  Model,
  ModelAttributes,
  ModelCtor,
  ModelOptions,
  UpdateOptions,
} from 'sequelize/types/lib/model'
import { MyModels } from '@models/_instance'
import { ValidationOptions } from 'sequelize/types/lib/instance-validator'
import { HookReturn } from 'sequelize/types/lib/hooks'
import { ModelManager } from 'sequelize/types/lib/model-manager'
import { ConnectionManager } from 'sequelize/types/lib/connection-manager'
import {
  ColumnsDescription,
  QueryInterface,
  QueryOptions,
  QueryOptionsWithModel,
  QueryOptionsWithType,
} from 'sequelize/types/lib/query-interface'
import * as DataTypes from 'sequelize/types/lib/data-types'
import { Fn } from 'sequelize/types/lib/utils'
import {
  Transaction,
  TransactionOptions,
} from 'sequelize/types/lib/transaction'
import {
  Config,
  Options,
  QueryOptionsTransactionRequired,
  SyncOptions,
} from 'sequelize/types/lib/sequelize'

interface Associate {
  associate: (models: MyModels) => void
}

declare module 'sequelize' {
  class Sequelize extends sequelize {
    public define<M extends Model, TCreationAttributes = M['_attributes']>(
      modelName: string,
      attributes: ModelAttributes<M, TCreationAttributes>,
      options?: ModelOptions
    ): ModelCtor<M> & Associate

    // -------------------- Utilities ------------------------------------------------------------------------

    /**
     * Creates a object representing a database function. This can be used in search queries, both in where and
     * order parts, and as default values in column definitions. If you want to refer to columns in your
     * function, you should use `sequelize.col`, so that the columns are properly interpreted as columns and
     * not a strings.
     *
     * Convert a user's username to upper case
     * ```js
     * instance.update({
     *   username: self.sequelize.fn('upper', self.sequelize.col('username'))
     * })
     * ```
     * @param fn The function you want to call
     * @param args All further arguments will be passed as arguments to the function
     */
    public static fn: typeof fn

    /**
     * Creates a object representing a column in the DB. This is often useful in conjunction with
     * `sequelize.fn`, since raw string arguments to fn will be escaped.
     *
     * @param col The name of the column
     */
    public static col: typeof col

    /**
     * Creates a object representing a call to the cast function.
     *
     * @param val The value to cast
     * @param type The type to cast it to
     */
    public static cast: typeof cast

    /**
     * Creates a object representing a literal, i.e. something that will not be escaped.
     *
     * @param val
     */
    public static literal: typeof literal

    /**
     * An AND query
     *
     * @param args Each argument will be joined by AND
     */
    public static and: typeof and

    /**
     * An OR query
     *
     * @param args Each argument will be joined by OR
     */
    public static or: typeof or

    /**
     * Creates an object representing nested where conditions for postgres's json data-type.
     *
     * @param conditionsOrPath A hash containing strings/numbers or other nested hash, a string using dot
     *   notation or a string using postgres json syntax.
     * @param value An optional value to compare against. Produces a string of the form "<json path> =
     *   '<value>'".
     */
    public static json: typeof json

    /**
     * A way of specifying attr = condition.
     *
     * The attr can either be an object taken from `Model.rawAttributes` (for example `Model.rawAttributes.id`
     * or
     * `Model.rawAttributes.name`). The attribute should be defined in your model definition. The attribute can
     * also be an object from one of the sequelize utility functions (`sequelize.fn`, `sequelize.col` etc.)
     *
     * For string attributes, use the regular `{ where: { attr: something }}` syntax. If you don't want your
     * string to be escaped, use `sequelize.literal`.
     *
     * @param attr The attribute, which can be either an attribute object from `Model.rawAttributes` or a
     *   sequelize object, for example an instance of `sequelize.fn`. For simple string attributes, use the
     *   POJO syntax
     * @param comparator Comparator
     * @param logic The condition. Can be both a simply type, or a further condition (`.or`, `.and`, `.literal`
     *   etc.)
     */
    public static where: typeof where

    /**
     * A hook that is run before validation
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public static beforeValidate(
      name: string,
      fn: (instance: Model, options: ValidationOptions) => void
    ): void

    public static beforeValidate(
      fn: (instance: Model, options: ValidationOptions) => void
    ): void

    /**
     * A hook that is run after validation
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public static afterValidate(
      name: string,
      fn: (instance: Model, options: ValidationOptions) => void
    ): void

    public static afterValidate(
      fn: (instance: Model, options: ValidationOptions) => void
    ): void

    /**
     * A hook that is run before creating a single instance
     *
     * @param name
     * @param fn A callback function that is called with attributes, options
     */
    public static beforeCreate(
      name: string,
      fn: (attributes: Model, options: CreateOptions<any>) => void
    ): void

    public static beforeCreate(
      fn: (attributes: Model, options: CreateOptions<any>) => void
    ): void

    /**
     * A hook that is run after creating a single instance
     *
     * @param name
     * @param fn A callback function that is called with attributes, options
     */
    public static afterCreate(
      name: string,
      fn: (attributes: Model, options: CreateOptions<any>) => void
    ): void

    public static afterCreate(
      fn: (attributes: Model, options: CreateOptions<any>) => void
    ): void

    /**
     * A hook that is run before destroying a single instance
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public static beforeDestroy(
      name: string,
      fn: (instance: Model, options: InstanceDestroyOptions) => void
    ): void

    public static beforeDestroy(
      fn: (instance: Model, options: InstanceDestroyOptions) => void
    ): void

    /**
     * A hook that is run after destroying a single instance
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public static afterDestroy(
      name: string,
      fn: (instance: Model, options: InstanceDestroyOptions) => void
    ): void

    public static afterDestroy(
      fn: (instance: Model, options: InstanceDestroyOptions) => void
    ): void

    /**
     * A hook that is run before updating a single instance
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public static beforeUpdate(
      name: string,
      fn: (instance: Model, options: UpdateOptions<any>) => void
    ): void

    public static beforeUpdate(
      fn: (instance: Model, options: UpdateOptions<any>) => void
    ): void

    /**
     * A hook that is run after updating a single instance
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public static afterUpdate(
      name: string,
      fn: (instance: Model, options: UpdateOptions<any>) => void
    ): void

    public static afterUpdate(
      fn: (instance: Model, options: UpdateOptions<any>) => void
    ): void

    /**
     * A hook that is run before creating or updating a single instance, It proxies `beforeCreate` and `beforeUpdate`
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public static beforeSave(
      name: string,
      fn: (
        instance: Model,
        options: UpdateOptions<any> | CreateOptions<any>
      ) => void
    ): void

    public static beforeSave(
      fn: (
        instance: Model,
        options: UpdateOptions<any> | CreateOptions<any>
      ) => void
    ): void

    /**
     * A hook that is run after creating or updating a single instance, It proxies `afterCreate` and `afterUpdate`
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public static afterSave(
      name: string,
      fn: (
        instance: Model,
        options: UpdateOptions<any> | CreateOptions<any>
      ) => void
    ): void

    public static afterSave(
      fn: (
        instance: Model,
        options: UpdateOptions<any> | CreateOptions<any>
      ) => void
    ): void

    /**
     * A hook that is run before creating instances in bulk
     *
     * @param name
     * @param fn A callback function that is called with instances, options
     */
    public static beforeBulkCreate(
      name: string,
      fn: (instances: Model[], options: BulkCreateOptions<any>) => void
    ): void

    public static beforeBulkCreate(
      fn: (instances: Model[], options: BulkCreateOptions<any>) => void
    ): void

    /**
     * A hook that is run after creating instances in bulk
     *
     * @param name
     * @param fn A callback function that is called with instances, options
     */
    public static afterBulkCreate(
      name: string,
      fn: (instances: Model[], options: BulkCreateOptions<any>) => void
    ): void

    public static afterBulkCreate(
      fn: (instances: Model[], options: BulkCreateOptions<any>) => void
    ): void

    /**
     * A hook that is run before destroying instances in bulk
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public static beforeBulkDestroy(
      name: string,
      fn: (options: BulkCreateOptions<any>) => void
    ): void

    public static beforeBulkDestroy(
      fn: (options: BulkCreateOptions<any>) => void
    ): void

    /**
     * A hook that is run after destroying instances in bulk
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public static afterBulkDestroy(
      name: string,
      fn: (options: DestroyOptions<any>) => void
    ): void

    public static afterBulkDestroy(
      fn: (options: DestroyOptions<any>) => void
    ): void

    /**
     * A hook that is run after updating instances in bulk
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public static beforeBulkUpdate(
      name: string,
      fn: (options: UpdateOptions<any>) => void
    ): void

    public static beforeBulkUpdate(
      fn: (options: UpdateOptions<any>) => void
    ): void

    /**
     * A hook that is run after updating instances in bulk
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public static afterBulkUpdate(
      name: string,
      fn: (options: UpdateOptions<any>) => void
    ): void

    public static afterBulkUpdate(
      fn: (options: UpdateOptions<any>) => void
    ): void

    /**
     * A hook that is run before a find (select) query
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public static beforeFind(
      name: string,
      fn: (options: FindOptions<any>) => void
    ): void

    public static beforeFind(fn: (options: FindOptions<any>) => void): void

    /**
     * A hook that is run before a connection is established
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public static beforeConnect(
      name: string,
      fn: (options: Config) => void
    ): void

    public static beforeConnect(fn: (options: Config) => void): void

    /**
     * A hook that is run after a connection is established
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public static afterConnect(
      name: string,
      fn: (connection: unknown, options: Config) => void
    ): void

    public static afterConnect(
      fn: (connection: unknown, options: Config) => void
    ): void

    /**
     * A hook that is run before a connection is released
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public static beforeDisconnect(
      name: string,
      fn: (connection: unknown) => void
    ): void

    public static beforeDisconnect(fn: (connection: unknown) => void): void

    /**
     * A hook that is run after a connection is released
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public static afterDisconnect(
      name: string,
      fn: (connection: unknown) => void
    ): void

    public static afterDisconnect(fn: (connection: unknown) => void): void

    /**
     * A hook that is run before a find (select) query, after any { include: {all: ...} } options are expanded
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public static beforeFindAfterExpandIncludeAll(
      name: string,
      fn: (options: FindOptions<any>) => void
    ): void

    public static beforeFindAfterExpandIncludeAll(
      fn: (options: FindOptions<any>) => void
    ): void

    /**
     * A hook that is run before a find (select) query, after all option parsing is complete
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public static beforeFindAfterOptions(
      name: string,
      fn: (options: FindOptions<any>) => void
    ): void

    public static beforeFindAfterOptions(
      fn: (options: FindOptions<any>) => void
    ): void

    /**
     * A hook that is run after a find (select) query
     *
     * @param name
     * @param fn   A callback function that is called with instance(s), options
     */
    public static afterFind(
      name: string,
      fn: (
        instancesOrInstance: Model[] | Model | null,
        options: FindOptions<any>
      ) => void
    ): void

    public static afterFind(
      fn: (
        instancesOrInstance: Model[] | Model | null,
        options: FindOptions<any>
      ) => void
    ): void

    /**
     * A hook that is run before a define call
     *
     * @param name
     * @param fn   A callback function that is called with attributes, options
     */
    public static beforeDefine<M extends Model>(
      name: string,
      fn: (
        attributes: ModelAttributes<M, M['_creationAttributes']>,
        options: ModelOptions<M>
      ) => void
    ): void

    public static beforeDefine<M extends Model>(
      fn: (
        attributes: ModelAttributes<M, M['_creationAttributes']>,
        options: ModelOptions<M>
      ) => void
    ): void

    /**
     * A hook that is run after a define call
     *
     * @param name
     * @param fn   A callback function that is called with factory
     */
    public static afterDefine(
      name: string,
      fn: (model: typeof Model) => void
    ): void

    public static afterDefine(fn: (model: typeof Model) => void): void

    /**
     * A hook that is run before Sequelize() call
     *
     * @param name
     * @param fn   A callback function that is called with config, options
     */
    public static beforeInit(
      name: string,
      fn: (config: Config, options: Options) => void
    ): void

    public static beforeInit(
      fn: (config: Config, options: Options) => void
    ): void

    /**
     * A hook that is run after Sequelize() call
     *
     * @param name
     * @param fn   A callback function that is called with sequelize
     */
    public static afterInit(
      name: string,
      fn: (sequelize: Sequelize) => void
    ): void

    public static afterInit(fn: (sequelize: Sequelize) => void): void

    /**
     * A hook that is run before sequelize.sync call
     * @param fn   A callback function that is called with options passed to sequelize.sync
     */
    public static beforeBulkSync(
      dname: string,
      fn: (options: SyncOptions) => HookReturn
    ): void

    public static beforeBulkSync(fn: (options: SyncOptions) => HookReturn): void

    /**
     * A hook that is run after sequelize.sync call
     * @param fn   A callback function that is called with options passed to sequelize.sync
     */
    public static afterBulkSync(
      name: string,
      fn: (options: SyncOptions) => HookReturn
    ): void

    public static afterBulkSync(fn: (options: SyncOptions) => HookReturn): void

    /**
     * A hook that is run before Model.sync call
     * @param fn   A callback function that is called with options passed to Model.sync
     */
    public static beforeSync(
      name: string,
      fn: (options: SyncOptions) => HookReturn
    ): void

    public static beforeSync(fn: (options: SyncOptions) => HookReturn): void

    /**
     * A hook that is run after Model.sync call
     * @param fn   A callback function that is called with options passed to Model.sync
     */
    public static afterSync(
      name: string,
      fn: (options: SyncOptions) => HookReturn
    ): void

    public static afterSync(fn: (options: SyncOptions) => HookReturn): void

    /**
     * Use CLS with Sequelize.
     * CLS namespace provided is stored as `Sequelize._cls`
     * and Promise is patched to use the namespace, using `cls-hooked` module.
     *
     * @param namespace
     */
    public static useCLS(namespace: object): typeof Sequelize

    /**
     * A reference to Sequelize constructor from sequelize. Useful for accessing DataTypes, Errors etc.
     */
    public Sequelize: typeof Sequelize

    /**
     * Final config that is used by sequelize.
     */
    public readonly config: Config

    public readonly modelManager: ModelManager

    public readonly connectionManager: ConnectionManager

    /**
     * Dictionary of all models linked with this instance.
     */
    public readonly models: {
      [key: string]: ModelCtor<Model>
    }

    /**
     * Instantiate sequelize with name of database, username and password
     *
     * #### Example usage
     *
     * ```javascript
     * // without password and options
     * const sequelize = new Sequelize('database', 'username')
     *
     * // without options
     * const sequelize = new Sequelize('database', 'username', 'password')
     *
     * // without password / with blank password
     * const sequelize = new Sequelize('database', 'username', null, {})
     *
     * // with password and options
     * const sequelize = new Sequelize('my_database', 'john', 'doe', {})
     *
     * // with uri (see below)
     * const sequelize = new Sequelize('mysql://localhost:3306/database', {})
     * ```
     *
     * @param database The name of the database
     * @param username The username which is used to authenticate against the
     *   database.
     * @param password The password which is used to authenticate against the
     *   database.
     * @param options An object with options.
     */
    constructor(
      database: string,
      username: string,
      password?: string,
      options?: Options
    )

    constructor(database: string, username: string, options?: Options)

    constructor(options?: Options)

    /**
     * Instantiate sequelize with an URI
     * @param uri A full database URI
     * @param options See above for possible options
     */
    constructor(uri: string, options?: Options)

    /**
     * A hook that is run before validation
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public beforeValidate(
      name: string,
      fn: (instance: Model, options: ValidationOptions) => void
    ): void

    public beforeValidate(
      fn: (instance: Model, options: ValidationOptions) => void
    ): void

    /**
     * A hook that is run after validation
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public afterValidate(
      name: string,
      fn: (instance: Model, options: ValidationOptions) => void
    ): void

    public afterValidate(
      fn: (instance: Model, options: ValidationOptions) => void
    ): void

    /**
     * A hook that is run before creating a single instance
     *
     * @param name
     * @param fn A callback function that is called with attributes, options
     */
    public beforeCreate(
      name: string,
      fn: (attributes: Model, options: CreateOptions<any>) => void
    ): void

    public beforeCreate(
      fn: (attributes: Model, options: CreateOptions<any>) => void
    ): void

    /**
     * A hook that is run after creating a single instance
     *
     * @param name
     * @param fn A callback function that is called with attributes, options
     */
    public afterCreate(
      name: string,
      fn: (attributes: Model, options: CreateOptions<any>) => void
    ): void

    public afterCreate(
      fn: (attributes: Model, options: CreateOptions<any>) => void
    ): void

    /**
     * A hook that is run before destroying a single instance
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public beforeDestroy(
      name: string,
      fn: (instance: Model, options: InstanceDestroyOptions) => void
    ): void

    public beforeDestroy(
      fn: (instance: Model, options: InstanceDestroyOptions) => void
    ): void

    /**
     * A hook that is run after destroying a single instance
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public afterDestroy(
      name: string,
      fn: (instance: Model, options: InstanceDestroyOptions) => void
    ): void

    public afterDestroy(
      fn: (instance: Model, options: InstanceDestroyOptions) => void
    ): void

    /**
     * A hook that is run before updating a single instance
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public beforeUpdate(
      name: string,
      fn: (instance: Model, options: UpdateOptions<any>) => void
    ): void

    public beforeUpdate(
      fn: (instance: Model, options: UpdateOptions<any>) => void
    ): void

    /**
     * A hook that is run after updating a single instance
     *
     * @param name
     * @param fn A callback function that is called with instance, options
     */
    public afterUpdate(
      name: string,
      fn: (instance: Model, options: UpdateOptions<any>) => void
    ): void

    public afterUpdate(
      fn: (instance: Model, options: UpdateOptions<any>) => void
    ): void

    /**
     * A hook that is run before creating instances in bulk
     *
     * @param name
     * @param fn A callback function that is called with instances, options
     */
    public beforeBulkCreate(
      name: string,
      fn: (instances: Model[], options: BulkCreateOptions<any>) => void
    ): void

    public beforeBulkCreate(
      fn: (instances: Model[], options: BulkCreateOptions<any>) => void
    ): void

    /**
     * A hook that is run after creating instances in bulk
     *
     * @param name
     * @param fn A callback function that is called with instances, options
     */
    public afterBulkCreate(
      name: string,
      fn: (instances: Model[], options: BulkCreateOptions<any>) => void
    ): void

    public afterBulkCreate(
      fn: (instances: Model[], options: BulkCreateOptions<any>) => void
    ): void

    /**
     * A hook that is run before destroying instances in bulk
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public beforeBulkDestroy(
      name: string,
      fn: (options: BulkCreateOptions<any>) => void
    ): void

    public beforeBulkDestroy(
      fn: (options: BulkCreateOptions<any>) => void
    ): void

    /**
     * A hook that is run after destroying instances in bulk
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public afterBulkDestroy(
      name: string,
      fn: (options: DestroyOptions<any>) => void
    ): void

    public afterBulkDestroy(fn: (options: DestroyOptions<any>) => void): void

    /**
     * A hook that is run after updating instances in bulk
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public beforeBulkUpdate(
      name: string,
      fn: (options: UpdateOptions<any>) => void
    ): void

    public beforeBulkUpdate(fn: (options: UpdateOptions<any>) => void): void

    /**
     * A hook that is run after updating instances in bulk
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public afterBulkUpdate(
      name: string,
      fn: (options: UpdateOptions<any>) => void
    ): void

    public afterBulkUpdate(fn: (options: UpdateOptions<any>) => void): void

    /**
     * A hook that is run before a find (select) query
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public beforeFind(
      name: string,
      fn: (options: FindOptions<any>) => void
    ): void

    public beforeFind(fn: (options: FindOptions<any>) => void): void

    /**
     * A hook that is run before a find (select) query, after any { include: {all: ...} } options are expanded
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public beforeFindAfterExpandIncludeAll(
      name: string,
      fn: (options: FindOptions<any>) => void
    ): void

    public beforeFindAfterExpandIncludeAll(
      fn: (options: FindOptions<any>) => void
    ): void

    /**
     * A hook that is run before a find (select) query, after all option parsing is complete
     *
     * @param name
     * @param fn   A callback function that is called with options
     */
    public beforeFindAfterOptions(
      name: string,
      fn: (options: FindOptions<any>) => void
    ): void

    public beforeFindAfterOptions(fn: (options: FindOptions<any>) => void): void

    /**
     * A hook that is run after a find (select) query
     *
     * @param name
     * @param fn   A callback function that is called with instance(s), options
     */
    public afterFind(
      name: string,
      fn: (
        instancesOrInstance: Model[] | Model | null,
        options: FindOptions<any>
      ) => void
    ): void

    public afterFind(
      fn: (
        instancesOrInstance: Model[] | Model | null,
        options: FindOptions<any>
      ) => void
    ): void

    /**
     * A hook that is run before a define call
     *
     * @param name
     * @param fn   A callback function that is called with attributes, options
     */
    public beforeDefine(
      name: string,
      fn: (
        attributes: ModelAttributes<Model, any>,
        options: ModelOptions
      ) => void
    ): void

    public beforeDefine(
      fn: (
        attributes: ModelAttributes<Model, any>,
        options: ModelOptions
      ) => void
    ): void

    /**
     * A hook that is run after a define call
     *
     * @param name
     * @param fn   A callback function that is called with factory
     */
    public afterDefine(name: string, fn: (model: typeof Model) => void): void

    public afterDefine(fn: (model: typeof Model) => void): void

    /**
     * A hook that is run before Sequelize() call
     *
     * @param name
     * @param fn   A callback function that is called with config, options
     */
    public beforeInit(
      name: string,
      fn: (config: Config, options: Options) => void
    ): void

    public beforeInit(fn: (config: Config, options: Options) => void): void

    /**
     * A hook that is run after Sequelize() call
     *
     * @param name
     * @param fn   A callback function that is called with sequelize
     */
    public afterInit(name: string, fn: (sequelize: Sequelize) => void): void

    public afterInit(fn: (sequelize: Sequelize) => void): void

    /**
     * A hook that is run before sequelize.sync call
     * @param fn   A callback function that is called with options passed to sequelize.sync
     */
    public beforeBulkSync(
      name: string,
      fn: (options: SyncOptions) => HookReturn
    ): void

    public beforeBulkSync(fn: (options: SyncOptions) => HookReturn): void

    /**
     * A hook that is run after sequelize.sync call
     * @param fn   A callback function that is called with options passed to sequelize.sync
     */
    public afterBulkSync(
      name: string,
      fn: (options: SyncOptions) => HookReturn
    ): void

    public afterBulkSync(fn: (options: SyncOptions) => HookReturn): void

    /**
     * A hook that is run before Model.sync call
     * @param fn   A callback function that is called with options passed to Model.sync
     */
    public beforeSync(
      name: string,
      fn: (options: SyncOptions) => HookReturn
    ): void

    public beforeSync(fn: (options: SyncOptions) => HookReturn): void

    /**
     * A hook that is run after Model.sync call
     * @param fn   A callback function that is called with options passed to Model.sync
     */
    public afterSync(
      name: string,
      fn: (options: SyncOptions) => HookReturn
    ): void

    public afterSync(fn: (options: SyncOptions) => HookReturn): void

    /**
     * Returns the specified dialect.
     */
    public getDialect(): string

    /**
     * Returns the database name.
     */

    public getDatabaseName(): string

    /**
     * Returns an instance of QueryInterface.
     */
    public getQueryInterface(): QueryInterface

    /**
     * Fetch a Model which is already defined
     *
     * @param modelName The name of a model defined with Sequelize.define
     */
    public model(modelName: string): ModelCtor<Model>

    /**
     * Checks whether a model with the given name is defined
     *
     * @param modelName The name of a model defined with Sequelize.define
     */
    public isDefined(modelName: string): boolean

    /**
     * Imports a model defined in another file
     *
     * Imported models are cached, so multiple calls to import with the same path will not load the file
     * multiple times
     *
     * See https://github.com/sequelize/sequelize/blob/master/examples/using-multiple-model-files/Task.js for a
     * short example of how to define your models in separate files so that they can be imported by
     * sequelize.import
     *
     * @param path The path to the file that holds the model you want to import. If the part is relative, it
     *   will be resolved relatively to the calling file
     *
     * @param defineFunction An optional function that provides model definitions. Useful if you do not
     *   want to use the module root as the define function
     */
    public import<T extends typeof Model>(
      path: string,
      defineFunction?: (sequelize: Sequelize, dataTypes: typeof DataTypes) => T
    ): T

    /**
     * Execute a query on the DB, optionally bypassing all the Sequelize goodness.
     *
     * By default, the function will return two arguments: an array of results, and a metadata object,
     * containing number of affected rows etc. Use `const [results, meta] = await ...` to access the results.
     *
     * If you are running a type of query where you don't need the metadata, for example a `SELECT` query, you
     * can pass in a query type to make sequelize format the results:
     *
     * ```js
     * const [results, metadata] = await sequelize.query('SELECT...'); // Raw query - use array destructuring
     *
     * const results = await sequelize.query('SELECT...', { type: sequelize.QueryTypes.SELECT }); // SELECT query - no destructuring
     * ```
     *
     * @param sql
     * @param options Query options
     */
    public query(
      sql: string | { query: string; values: unknown[] },
      options: QueryOptionsWithType<QueryTypes.UPDATE>
    ): Promise<[undefined, number]>

    public query(
      sql: string | { query: string; values: unknown[] },
      options: QueryOptionsWithType<QueryTypes.BULKUPDATE>
    ): Promise<number>

    public query(
      sql: string | { query: string; values: unknown[] },
      options: QueryOptionsWithType<QueryTypes.INSERT>
    ): Promise<[number, number]>

    public query(
      sql: string | { query: string; values: unknown[] },
      options: QueryOptionsWithType<QueryTypes.UPSERT>
    ): Promise<number>

    public query(
      sql: string | { query: string; values: unknown[] },
      options: QueryOptionsWithType<QueryTypes.DELETE>
    ): Promise<void>

    public query(
      sql: string | { query: string; values: unknown[] },
      options: QueryOptionsWithType<QueryTypes.BULKDELETE>
    ): Promise<number>

    public query(
      sql: string | { query: string; values: unknown[] },
      options: QueryOptionsWithType<QueryTypes.SHOWTABLES>
    ): Promise<string[]>

    public query(
      sql: string | { query: string; values: unknown[] },
      options: QueryOptionsWithType<QueryTypes.DESCRIBE>
    ): Promise<ColumnsDescription>

    public query<M extends Model>(
      sql: string | { query: string; values: unknown[] },
      options: QueryOptionsWithModel<M>
    ): Promise<M[]>

    public query<T extends object>(
      sql: string | { query: string; values: unknown[] },
      options: QueryOptionsWithType<QueryTypes.SELECT> & { plain: true }
    ): Promise<T>

    public query<T extends object>(
      sql: string | { query: string; values: unknown[] },
      options: QueryOptionsWithType<QueryTypes.SELECT>
    ): Promise<T[]>

    public query(
      sql: string | { query: string; values: unknown[] },
      options: (QueryOptions | QueryOptionsWithType<QueryTypes.RAW>) & {
        plain: true
      }
    ): Promise<{ [key: string]: unknown }>

    public query(
      sql: string | { query: string; values: unknown[] },
      options?: QueryOptions | QueryOptionsWithType<QueryTypes.RAW>
    ): Promise<[unknown[], unknown]>

    /**
     * Get the fn for random based on the dialect
     */
    public random(): Fn

    /**
     * Execute a query which would set an environment or user variable. The variables are set per connection,
     * so this function needs a transaction.
     *
     * Only works for MySQL.
     *
     * @param variables object with multiple variables.
     * @param options Query options.
     */
    public set(
      variables: object,
      options: QueryOptionsTransactionRequired
    ): Promise<unknown>

    /**
     * Escape value.
     *
     * @param value Value that needs to be escaped
     */
    public escape(value: string | number | Date): string

    /**
     * Create a new database schema.
     *
     * Note,that this is a schema in the
     * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
     * not a database table. In mysql and sqlite, this command will do nothing.
     *
     * @param schema Name of the schema
     * @param options Options supplied
     */
    public createSchema(schema: string, options: Logging): Promise<unknown>

    /**
     * Show all defined schemas
     *
     * Note,that this is a schema in the
     * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
     * not a database table. In mysql and sqlite, this will show all tables.
     *
     * @param options Options supplied
     */
    public showAllSchemas(options: Logging): Promise<object[]>

    /**
     * Drop a single schema
     *
     * Note,that this is a schema in the
     * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
     * not a database table. In mysql and sqlite, this drop a table matching the schema name
     *
     * @param schema Name of the schema
     * @param options Options supplied
     */
    public dropSchema(schema: string, options: Logging): Promise<unknown[]>

    /**
     * Drop all schemas
     *
     * Note,that this is a schema in the
     * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
     * not a database table. In mysql and sqlite, this is the equivalent of drop all tables.
     *
     * @param options Options supplied
     */
    public dropAllSchemas(options: Logging): Promise<unknown[]>

    /**
     * Sync all defined models to the DB.
     *
     * @param options Sync Options
     */
    public sync(options?: SyncOptions): Promise<this>

    /**
     * Truncate all tables defined through the sequelize models. This is done
     * by calling Model.truncate() on each model.
     *
     * @param [options] The options passed to Model.destroy in addition to truncate
     */
    public truncate(options?: DestroyOptions<any>): Promise<unknown[]>

    /**
     * Drop all tables defined through this sequelize instance. This is done by calling Model.drop on each model
     *
     * @param options The options passed to each call to Model.drop
     */
    public drop(options?: DropOptions): Promise<unknown[]>

    /**
     * Test the connection by trying to authenticate
     *
     * @param options Query Options for authentication
     */
    public authenticate(options?: QueryOptions): Promise<void>

    public validate(options?: QueryOptions): Promise<void>

    /**
     * Start a transaction. When using transactions, you should pass the transaction in the options argument
     * in order for the query to happen under that transaction
     *
     * ```js
     *   try {
     *     const transaction = await sequelize.transaction();
     *     const user = await User.findOne(..., { transaction });
     *     await user.update(..., { transaction });
     *     await transaction.commit();
     *   } catch(err) {
     *     await transaction.rollback();
     *   }
     * })
     * ```
     *
     * A syntax for automatically committing or rolling back based on the promise chain resolution is also
     * supported:
     *
     * ```js
     * try {
     *   await sequelize.transaction(transaction => { // Note that we pass a callback rather than awaiting the call with no arguments
     *     const user = await User.findOne(..., {transaction});
     *     await user.update(..., {transaction});
     *   });
     *   // Committed
     * } catch(err) {
     *   // Rolled back
     *   console.error(err);
     * }
     * ```
     *
     * If you have [CLS](https://github.com/Jeff-Lewis/cls-hooked) enabled, the transaction
     * will automatically be passed to any query that runs witin the callback. To enable CLS, add it do your
     * project, create a namespace and set it on the sequelize constructor:
     *
     * ```js
     * const cls = require('cls-hooked');
     * const namespace = cls.createNamespace('....');
     * const Sequelize = require('sequelize');
     * Sequelize.useCLS(namespace);
     * ```
     * Note, that CLS is enabled for all sequelize instances, and all instances will share the same namespace
     *
     * @param options Transaction Options
     * @param autoCallback Callback for the transaction
     */
    public transaction<T>(
      options: TransactionOptions,
      autoCallback: (t: Transaction) => PromiseLike<T>
    ): Promise<T>

    public transaction<T>(
      autoCallback: (t: Transaction) => PromiseLike<T>
    ): Promise<T>

    public transaction(options?: TransactionOptions): Promise<Transaction>

    /**
     * Close all connections used by this sequelize instance, and free all references so the instance can be
     * garbage collected.
     *
     * Normally this is done on process exit, so you only need to call this method if you are creating multiple
     * instances, and want to garbage collect some of them.
     */
    public close(): Promise<void>

    /**
     * Returns the database version
     */
    public databaseVersion(): Promise<string>
  }
}
