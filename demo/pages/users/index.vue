<template>
  <b-container fluid>
    <b-table
      striped
      hover
      :items="user.all"
      responsive
      bordered
      no-local-sorting
      :fields="fields"
      :sort-by.sync="orderBy"
      :sort-desc.sync="sortDesc"
    >
      <template v-slot:cell(actions)="row">
        <b-button size="sm" class="mr-1" variant="info">
          Detail
        </b-button>
        <b-button size="sm" variant="danger">
          Delete
        </b-button>
      </template>
    </b-table>
    <b-col sm="7" md="6" class="my-1">
      <b-pagination
        v-model="currentPage"
        :total-rows="user.pagination.total"
        :per-page="perPage"
        align="fill"
        size="sm"
        class="my-0"
      />
    </b-col>
  </b-container>
</template>

<script lang="ts">
import { mapState } from "vuex";
import type { Context } from "@nuxt/types";

export default {
  name: "UserIndex",
  middleware: ["auth"],
  async asyncData({ store }: Context): Promise<object | void> {
    await store.dispatch("user/all");
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Name", sortable: true, sortDirection: "desc" },
        { key: "email", label: "Email", sortable: true, class: "text-center" },
        {
          key: "created_at",
          label: "CreatedAt",
          sortable: true,
          sortByFormatted: true,
          filterByFormatted: true
        },
        { key: "actions", label: "Actions" }
      ],
      totalRows: 1,
      pageOptions: [5, 10, 15],
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: ""
      }
    };
  },
  computed: {
    ...mapState(["user"]),
    currentPage: {
      get() {
        return this.user.pagination.currentPage
      },
      set(page) {
        this.setPage(page)
      }
    },
    perPage: {
      get() {
        return this.user.pagination.perPage
      },
      set(limit) {
        this.setLimit(limit)
      }
    },
    orderBy: {
      get() {
        return 'name'
      },
      set(orderBy) {
        const sortedBy = this.sortDesc ? 'desc' : 'asc'
        this.fetchUser({ orderBy, sortedBy })
      }
    },
    sortDesc: {
      get() {
        return false
      },
      set(desc) {
        const sortedBy = desc ? 'desc' : 'asc'
        const orderBy = this.orderBy
        this.fetchUser({ sortedBy, orderBy })
      }
    }
  },
  methods: {
    setPage(page) {
      this.$store.dispatch('user/all', {
        fn: (proxy) => {
          proxy.setParameters({ page })
        }
      })
    },
    setLimit(limit) {
      this.$store.dispatch('user/all', {
        fn: (proxy) => {
          proxy.setParameters({ limit })
        }
      })
    },
    fetchUser(payload?: PayloadOption) {
      const { limit, page, sortedBy, orderBy } = payload || {}
      this.$store.dispatch('user/all', {
        fn: (proxy) => {
          proxy.setParameters({ limit, page, sortedBy, orderBy })
        }
      })
    }
  }
};

export interface PayloadOption {
  limit?: number,
  page?: number,
  orderBy?: string,
  sortedBy?: string
}

</script>
