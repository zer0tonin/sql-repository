# SQL-REPOSITORY

Sql-repository is a simple Knex based implementation of the repository pattern for Node.js. 
It abstracts access to a given database table with simple methods like *load*, *list* or *create*.

## Installation

Simply install the library using :

```
npm install sql-repository --save
```

or

```
yarn add sql-repository
```

Sql-repository is supposed to work alongside a [Knex](http://knexjs.org) installation. So please run :

```
npm install knex --save
```

or 

```
yarn add knex
```

## How to use

The repository constructor expects 3 parameters :
- an initialized [Knex](http://knexjs.org/) instance
- a table name
- a constructor corresponding to the model

You can directly instanciated a repository like this :

```javascript
import Repository from 'sql-repository';
import knex from 'knex';

const db = knex({
    client: 'postgresql',
    connection: {
      database: 'myDb',
      host: 'myHost',
      user: 'myUser',
      password: 'myPass',
    },
    migrations: {
      tablename: 'knex_migrations',
    }
  })

class Foo {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.bar = data.bar;
  }
}

const fooRepository = new Repository(db, 'foo', Foo);

// will generate an array of Foo objects from the content of the foo table
const foos = fooRepository.list();
```

To avoid repeating yourself it can be useful to create a class inheriting from sql-repository:

```javascript
class FooRepository extends Repository {
  constructor(db) {
    super(db, 'foo', Foo);
  }
}

const fooRepository = new FooRepository(db);
const foos = fooRepository.list();
```

The constructor will take two additionnal optionnal parameters:
* dataToPersist: a function allowing you to select which property to persists and how to map it to the database columns.
* formatDataForConstructor: a function allowing you to map data from the database columns to the object expected by your model's constructor.

Example:

```javascript
const dataToPersist = foo => ({
  name: foo.name,
  bar_id: foo.bar,
});

const formatDataForConstructor = data => ({
  id: data.id,
  name: data.name,
  bar: data.bar_id,
});

const fooRepository = new Repository(db, 'foo', Foo, dataToPersist, formatDataForConstructor);
```

## Methods

### Table of Contents

-   [Repository](#repository)
    -   [constructor](#constructor)
    -   [load](#load)
    -   [list](#list)
    -   [create](#create)
    -   [update](#update)
    -   [delete](#delete)

#### Repository

Abstracts CRUD operations with the database,
to allow easier implementation of the pattern

#### constructor

Initialize the Repository

*Parameters*

-   `db` *[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)* The knex instance
-   `table` *[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)* The name of the SQL table
-   `constructor` *[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)* The constructor for the associated model
-   `dataToPersist` *[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)* Tells which data should be persisted in database for a given object (optional, default `data=>data`)
-   `formatDataForConstructor` *[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)* Change data format from database to constructor (ie. start_date -> startDate) (optional, default `data=>data`)

#### load

Loads an entity from the given id

*Parameters*

-   `id` *int* The object's id

Returns *[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)* The corresponding entity

#### list

Lists the entities

*Parameters*

-   `whereClause` *[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)* Conditions (optional, default `{}`)

Returns *[array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)* A list of entities

#### create

Persists a new entity in database

*Parameters*

-   `object` *[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)* The entity to persist

Returns *[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)* An entity, with a database generated id

#### update

Updates an enitity in database

*Parameters*

-   `object` *[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)* The entity to persist in database

Returns *[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)* True if the operation was a success

#### delete

Deletes an entity from database

*Parameters*

-   `id` *[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)* The entity's id

Returns *[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)* True if the operation was a success
