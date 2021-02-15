# Vue Api Queries.

[![Build Status](https://travis-ci.com/Chantouch/vue-api-queries.svg?branch=master)](https://travis-ci.com/Chantouch/vue-api-queries)
[![Latest Version on NPM](https://img.shields.io/npm/v/vue-api-queries.svg?style=flat-square)](https://npmjs.com/package/vue-api-queries)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![npm](https://img.shields.io/npm/dt/vue-api-queries.svg?style=flat-square)](https://npmjs.com/package/vue-api-queries)
[![npm](https://img.shields.io/npm/dm/vue-api-queries.svg?style=flat-square)](https://npmjs.com/package/vue-api-queries)

🔥  If you use Laravel, this package matches perfectly with [andersao/l5-repository](https://github.com/andersao/l5-repository).

This package helps you quickly to build requests for REST API. Move your logic and backend requests to dedicated classes. Keep your code clean and elegant.

Wouldn't it be great if you could just use your back end to validate forms on the front end? This package provides a
 `BaseProxy` class that does exactly that. It can post itself to a configured endpoint and manage errors. The class
  is meant to be used with a Laravel back end and it doesn't limit that you need only to work with laravel, Ruby on
   Rail, NodeJs, ExpressJs, or any other languages.

Take a look at the [usage section](#usage) to view a detailed example on how to use it.

## Install

You can install the package via yarn (or npm):

```npm
npm install vue-api-queries
```
```yarn
yarn add vue-api-queries
```

## Usage

```js
import Vue from 'vue'
import VueApiQueries from 'vue-api-queries'

Vue.use(VueApiQueries)
```

## Nuxt Support

Put it on top of axios module

```js
export default {
    modules: [
       'vue-api-queries/nuxt',
       '@nuxtjs/axios',
    ]
}
```

### Note:
`baseURL` is required. <br />
You can define `baseURL` at .env just one of them
```bash
API_URL=http://localhost::3000/api
API_HOST=http://localhost::3000/api
```

if your axios already defined in `nuxt.config.js`
```js
export default {
    axios: {
        baseURL: process.env.API_URL
    }
}
```

### Advance usage
-------------- Todo --------------

### Vue plugins

```js
import Vue from 'vue'
import VueApiQueries from 'vue-api-queries'

Vue.use(VueApiQueries)
```

### Note
Error response must look like: 
```json
{
    "errors": {
        "field": [
            "The field is required."
        ]
    }
}
```

It will create ```$errors``` object inside components.

## Methods are available:

Validator                   | Description
--------------------------- | --------------------------------------
**has(field = null)**       | check specific field error
**first(field)**            | get message by field name.
**missed(field = null)**    | check if there is no any error of given field name.
**nullState(field = null)** | false|null of given field.
**any()**                   | check if any errors exist.
**get(field)**              | get specific field.
**all()**                   | get all errors.
**fill(errors = {})**       | fill the errors object.
**flush()**                 | clear all errors.
**clear(field)**            | clear specific error by field name.
**onKeydown(event)**        | event to clear error by event.target.name. (input the has name).

## Using with Vuex

1.Create proxies folder

``~/proxies/NewsProxy.js``

```js
import { BaseProxy } from 'vue-api-queries'

class NewsProxy extends BaseProxy {
  constructor(parameters = {}) {
    super('news', parameters)
  }
}

export default NewsProxy
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
import { NewsProxy } from '~/proxies'
import { BaseTransformer, PaginationTransformer } from 'vue-api-queries'
import { pagination, notify } from '~/utils'

const proxy = new NewsProxy()

const all = async ({ commit, dispatch }, payload = {}) => {
  const { fn } = payload
  if (typeof fn === 'function') {
    await fn(proxy)
  }
  try {
    const { data, meta } = await proxy.all()
    const all = {
      items: BaseTransformer.fetchCollection(data),
      pagination: PaginationTransformer.fetch(meta)
    }
    await commit(ALL, all)
  } catch (e) {
    const data = { items: [], pagination }
    await commit(ALL, data)
    await notify({ response: e })
  }
}

export default {
  all
}
```
---
getters.js
```js
export default {
  all: (state) => state.all
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
  }
}
```
---
state.js
```js
export default () => ({
  all: [],
  pagination: {}
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
          fn: (proxy) => {
            proxy
              .setParameters({
                userId: id,
                include: ['categories']
              })
              .removeParameters(['page', 'limit'])
          }
        })
    }
}
```

- `mounted()`
```js
export default {
    mounted() {
        const { id = null } = this.$auth.user
        this.$store.dispatch('news/all', {
          fn: (proxy) => {
            proxy
              .setParameters({
                userId: id,
                include: ['categories']
              })
              .removeParameters(['page', 'limit'])
          }
        })
    }
}
```

You can set or remove any parameters you like.

## Proxy's methods are available

Method                                              | Description
--------------------------------------------------- | --------------------------------------
**setParameter(key, value)**                        | Set param by key and value
**removeParameter(key)**                            | Remove param by key
**setParameters({ key: value, key1: value1 })**     | Set params by key and value
**removeParameters([key1, key2])**                  | Remove params by keys
**removeParameters()**                              | Remove all params

if setParameter that value is empty or null it will remove that param for query string

Be sure to use only once in `mounted()` or `asyncData()` and `asyncData()` is only available in `NuxtJs`

## Use proxy in components

- news/_id.vue pages

```js
import { NewsProxy } from '~/proxies'

const proxy = new NewsProxy()

export default {
    methods: {
        async fetchNews(id) {
            try {
              const { data } = await proxy.find(id)
              this.detail = data
            } catch (e) {
              console.log(e)
            }
        }
    },
    mounted() {
        this.fetchNews(this.$route.params.id)
    }
}
```

## Validations

Can use `vue-vlidator` for client-side validator that inspired by Laravel. 
[Chantouch/vue-vlidator](https://github.com/Chantouch/vue-vlidator)

### Errors methods available

It can be called by `this.$errors.**`

Method                           | Description
-------------------------------- | --------------------------------------
**all()**                        | To get all errors messages
**has(attribute)**                        | To check an attribute as any error
**has(attributes)**                        | To check multiple attributes given have any errors
**first(attribute)**                        | To get errors message by an attribute


## How to use in vue component

```vue
<template>
  <v-form v-model="valid" lazy-validation @keydown.native="$errors.onKeydown" @submit.prevent='submit'>
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
            @focus="validate"
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
          <v-text-field
            v-model="email"
            :counter="10"
            label="Email"
            required
            :error-messages="$errors.first('email')"
          />
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
        email: this.email
      })
    }
  },
  beforeDestroy() {
    this.$errors.flush()
  }
}
</script>
```

# Contact

Email: chantouchsek.cs83@gmail.com

Twitter [@DevidCs83](https://twitter.com/DevidCs83)
