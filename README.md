# Vue Axios Http

[![ci](https://github.com/chantouchsek/vue-axios-http/actions/workflows/ci.yml/badge.svg)](https://github.com/chantouchsek/vue-axios-http/actions/workflows/ci.yml)
[![Latest Version on NPM](https://img.shields.io/npm/v/vue-axios-http.svg?style=flat-square)](https://npmjs.com/package/vue-axios-http)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/dt/vue-axios-http.svg?style=flat-square)](https://npmjs.com/package/vue-axios-http)
[![npm](https://img.shields.io/npm/dm/vue-axios-http.svg?style=flat-square)](https://npmjs.com/package/vue-axios-http)

This package helps you quickly to build requests for REST API. Move your logic and backend requests to dedicated
classes. Keep your code clean and elegant.

Wouldn't it be great if you could just use your back end to validate forms on the front end? This package provides a
`BaseService` class that does exactly that. It can post itself to a configured endpoint and manage errors. The class is
meant to be used with a Laravel back end, and it doesn't limit that you need only to work with laravel, Ruby on Rail,
Node.js, Express.js, or any other languages.

Take a look at the [usage section](#usage) to view a detailed example on how to use it.

## Install

You can install the package via yarn (or npm):

```npm
npm install vue-axios-http
```

```yarn
yarn add vue-axios-http
```

## Usage

```js
import Vue from 'vue'
import AxiosHttp from 'vue-axios-http'

Vue.use(AxiosHttp)
```

## Nuxt Support

Put it on top of axios module

```js
export default {
  modules: [
    // simple usage
    'vue-axios-http/nuxt',
    // With options
    ['vue-axios-http/nuxt', { errorProperty: 'errors', resetParameter: true }],
    '@nuxtjs/axios',
  ],
  axiosHttp: { errorProperty: 'errors', resetParameter: true },
}
```

### Options

you can overwrite it by adding in the config above.

### Note:

`baseURL` is required.

You can define `baseURL` at .env just one of them

```bash
API_URL=http://localhost::3000/api
API_HOST=http://localhost::3000/api
```

if your axios already defined in `nuxt.config.js`

```js
export default {
  axios: {
    baseURL: process.env.API_URL,
  },
}
```

### Advance usage

-------------- Todo --------------

### Vue plugins

```js
import Vue from 'vue'
import AxiosHttp from 'vue-axios-http'

Vue.use(AxiosHttp)
```

### Note

Error response must look like: or based on **errorProperty** from config

```json
{
  "errors": {
    "field": ["The field is required."]
  }
}
```

It will create `$errors` object inside components.

## Methods are available:

| Validator                            | Description                                                      |
| ------------------------------------ | ---------------------------------------------------------------- |
| **has(field = null)**                | check specific field error                                       |
| **first(field)**                     | get message by field name.                                       |
| **missed(field = null)**             | check if there is no any error of given field name.              |
| **nullState(field = null)**          | Check if null of given field.                                    |
| **any()**                            | check if any errors exist.                                       |
| **get(field)**                       | get specific field.                                              |
| **all()**                            | get all errors.                                                  |
| **count()**                          | get errors count.                                                |
| **fill(errors = {})**                | fill the errors object.                                          |
| **flush()**                          | clear all errors.                                                |
| **clear(field)**                     | clear specific error by field name.                              |
| **onKeydown(event, 'baseFormName')** | event to clear error by event.target.name. (input the has name). |

#### first(field || fields)

```js
const errors = { name: [{ kh: ['This fist name field is required'] }] }

$errors.first('name') // return array
$errors.first('name[0]') // return object like
$errors.first('name[0].kh') // return string like

$errors.first(['name']) // return array
$errors.first(['name[0]']) // return object like
$errors.first(['name[0].kh']) // return string like
```

## Using it with Vuex

1.Create **proxies** folder or your prefer folder name for this

`~/proxies/NewsService.js`

```js
import { BaseService } from 'vue-axios-http'

class NewsService extends BaseService {
  constructor(parameters = {}) {
    super('news', parameters)
  }
}

export default NewsService
```

2.Store

- Create news store

1. actions.js
2. getters.js
3. mutation-types.js
4. mutations.js
5. state

---

actions.js

```js
import { ALL } from './mutation-types'
import { NewsService } from '~/proxies'
import { BaseTransformer, PaginationTransformer } from 'vue-axios-http'
import { pagination, notify } from '~/utils'

const service = new NewsService()

const all = async ({ commit, dispatch }, payload = {}) => {
  const { fn } = payload
  if (typeof fn === 'function') {
    await fn(service)
  }
  try {
    const { data, meta } = await service.all()
    const all = {
      items: BaseTransformer.fetchCollection(data),
      pagination: PaginationTransformer.fetch(meta),
    }
    await commit(ALL, all)
  } catch (e) {
    const data = { items: [], pagination }
    await commit(ALL, data)
    await notify({ response: e })
  }
}

export default {
  all,
}
```

---

getters.js

```js
export default {
  all: (state) => state.all,
}
```

---

mutation-types.js

```js
export const ALL = 'ALL'

export default { ALL }
```

---

mutations.js

```js
import { ALL } from './mutation-types'

export default {
  [ALL](state, payload = {}) {
    const { items = [], pagination = {} } = payload
    state.all = items
    state.pagination = pagination
  },
}
```

---

state.js

```js
export default () => ({
  all: [],
  pagination: {},
})
```

## How to call in components or pages

- news.vue pages

It can be called in `mounted()` or `asyncData()`

- `asyncData()`

```js
export default {
  async asyncData({ app, store }) {
    const { id = null } = app.$auth.user
    await store.dispatch('news/all', {
      fn: (service) => {
        service
          .setParameters({
            userId: id,
            include: ['categories'],
          })
          .removeParameters(['page', 'limit'])
      },
    })
  },
}
```

- `mounted()`

```js
export default {
  mounted() {
    const { id = null } = this.$auth.user
    this.$store.dispatch('news/all', {
      fn: (service) => {
        service
          .setParameters({
            userId: id,
            include: ['categories'],
          })
          .removeParameters(['page', 'limit'])
      },
    })
  },
}
```

You can set or remove any parameters you like.

## Service methods are available

| Method                                          | Description                 |
| ----------------------------------------------- | --------------------------- |
| **setParameter(key, value)**                    | Set param by key and value  |
| **removeParameter(key)**                        | Remove param by key         |
| **setParameters({ key: value, key1: value1 })** | Set params by key and value |
| **removeParameters([key1, key2])**              | Remove params by keys       |
| **removeParameters()**                          | Remove all params           |

#### setParameters()

Set parameters with key/value.

**Note**: If you to pass query string, as an object that can be response like object format at api side.

#### Example

```js
const service = new ExampleService()
const parameters = {
  search: {
    first_name: 'Sek',
    last_name: 'Chantouch',
  },
  page: {
    limit: 20,
    offset: 1,
  },
  order: {
    first_name: 'ASC',
    last_name: 'DESC',
  },
  category_id: 6,
}
const { data } = service.setParameters(parameters).all()
this.data = data
```

**Note**: A query object above will transform into query string like:

```text
https://my-web-url.com?search[first_name]=Sek&search[last_name]=Chantouch&page[limit]=10&page[offset]=1&order[first_name]=asc&order[last_name]=desc&category_id=6
```

if setParameter that value is empty or null, it will remove that param for query string

#### setParameter()

#### Example 1

```js
const service = new ExampleService()
const { data } = await service.setParameter('page', 1).all()
this.data = data
```

Expected will be:

```json
{
  "page": 1
}
```

#### Example 2

```js
const service = new ExampleService()
const queryString = 'limit=10&page=1&search[name]=hello'
const { data } = await service.setParameter(queryString).all()
this.data = data
```

Expected will be:

```json
{
  "limit": 10,
  "page": 1,
  "search": {
    "name": "hello"
  }
}
```

Be sure to use only once in `mounted()` or `asyncData()` and `asyncData()` is only available in `NuxtJs`

## Use service in components

- news/\_id.vue pages

```js
import { NewsService } from '~/proxies'

const service = new NewsService()

export default {
  methods: {
    async fetchNews(id) {
      try {
        const { data } = await service.find(id)
        this.detail = data
      } catch (e) {
        console.log(e)
      }
    },
  },
  mounted() {
    this.fetchNews(this.$route.params.id)
  },
}
```

## Validations

Can use `vue-vlidator` for client-side validator that inspired by Laravel.
[Chantouch/vue-vlidator](https://github.com/Chantouch/vue-vlidator)

### Errors methods available

It can be called by `this.$errors.**`

| Method               | Description                                        |
| -------------------- | -------------------------------------------------- |
| **all()**            | To get all errors messages                         |
| **has(attribute)**   | To check an attribute as any error                 |
| **has(attributes)**  | To check multiple attributes given have any errors |
| **first(attribute)** | To get errors message by an attribute              |

## How to use in a vue component

```vue
<template>
  <v-form v-model="valid" lazy-validation @keydown.native="$errors.onKeydown" @submit.prevent="submit">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="firstname"
            :error-messages="$errors.first(['firstname'])"
            :counter="10"
            label="First name"
            required
            name="firstname"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="lastname"
            :counter="10"
            label="Last name"
            required
            :error-messages="$errors.first(['lastname'])"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="email" :counter="10" label="Email" required :error-messages="$errors.first('email')" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="email" label="E-mail" required />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
export default {
  data: () => ({
    valid: false,
    firstname: '',
    lastname: '',
    email: '',
  }),
  methods: {
    submit() {
      this.$axios.$post('/account/create', {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
      })
    },
  },
  beforeDestroy() {
    this.$errors.flush()
  },
}
</script>
```

# Contact

Email: chantouchsek.cs83@gmail.com

Twitter [@DevidCs83](https://twitter.com/DevidCs83)
