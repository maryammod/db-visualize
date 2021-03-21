<template>
  <div class="bg-gray-200">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-12 gap-0 min-h-screen">
        <div class="col-span-3 bg-gray-200">
          <div class="sticky top-0 max-h-screen overflow-y-scroll">
            <vs-collapse>
              <vs-collapse-item
                v-for="(rows, key) of byLabel"
                :key="key"
                class="w-full"
              >
                <div slot="header">
                  <span>Label:</span>
                  <span class="font-bold">{{ key }}</span>
                </div>
                <div class="">
                  <button
                    type="button"
                    v-for="(plants, plant_id_2) in group(rows, 'plant_id_2')"
                    :key="plant_id_2"
                    v-scroll-to="`#plant_${plant_id_2}`"
                    class="mr-2 mb-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {{ plant_id_2 }}
                  </button>
                </div>
              </vs-collapse-item>
            </vs-collapse>
          </div>
        </div>
        <div class="col-span-9 bg-gray-100">
          <form
            @submit.prevent="search"
            class="sticky z-30 bg-gray-100 shadow-sm top-0 p-8 flex items-center space-x-4"
          >
            <span class="">Filter:</span>
            <input
              type="text"
              placeholder="Filter by plant_id, label, filename, age"
              v-model="filter"
              class="border px-4 py-2 max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-400 rounded-md"
            />
            <button
              type="submit"
              class="inline-flex justify-center py-1.5 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
            <button
              @click.prevent="clear"
              class="p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              clear
            </button>
          </form>
          <ul class="px-8 md:px-12">
            <div
              v-if="!getPhotos.length"
              class="w-full p-16 border-2 border-gray-500 border-dashed rounded-lg text-center mt-16"
            >
              No results found!
            </div>
            <li
              v-for="(rows, key) of byLabel"
              :key="key"
              class="border-b-2 border-gray-300"
            >
              <ul class="divide-y divide-gray-400">
                <li
                  v-for="(plants, plant_id_2) in group(rows, 'plant_id_2')"
                  :key="plant_id_2"
                  :id="`plant_${plant_id_2}`"
                  class="py-16"
                >
                  <div class="mb-4">
                    <p>plant_id:</p>
                    <h1 class="text-2xl font-bold">{{ plant_id_2 }}</h1>
                  </div>
                  <ul
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    <li v-for="plant in plants" :key="plant._id">
                      <div
                        class="flex flex-col overflow-hidden rounded-lg shadow-sm relative"
                        style="padding-top: 100%"
                      >
                        <cld-image
                          :public-id="publicId(plant.filename)"
                          :alt="plant._id"
                          responsive
                          loading="lazy"
                          class="w-full absolute top-0 left-0 z-10"
                        >
                          <cld-placeholder type="blur" />
                        </cld-image>
                        <div
                          class="absolute top-0 left-0 text-white p-4 z-20 text-xs"
                        >
                          {{ plant.label_2 }} <br />
                          {{ plant.plant_id_2 }} <br />
                          {{ plant.age }} days
                        </div>
                        <ul class="bg-white p-4 text-xs text-gray-800">
                          <li>
                            <span class="font-bold">Label:</span>
                            {{ plant.label_2 }}
                          </li>
                          <li>
                            <span class="font-bold">Plant_id:</span>
                            {{ plant.plant_id_2 }}
                          </li>
                          <li>
                            <span class="font-bold">Filename:</span>
                            {{ plant.filename }}
                          </li>
                          <li>
                            <span class="font-bold">Age:</span>
                            {{ plant.age }} days
                          </li>
                          <li>
                            <span class="font-bold">Planted:</span>
                            {{ $moment(plant.planted_at).format('YYYY/MM/DD') }}
                          </li>
                          <li>
                            <span class="font-bold">Taken:</span>
                            {{ $moment(plant.taken_at).format('YYYY/MM/DD') }}
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import groupBy from 'lodash.groupby'
import orderBy from 'lodash.orderby'
import sortBy from 'lodash.sortby'
import Fuse from 'fuse.js'

export default {
  async asyncData({ $content, error }) {
    const data = await $content('results')
      .fetch()
      .catch((err) => {
        error({ statusCode: 404, message: 'Page not found' })
      })
    const ordered = orderBy(data.rows, 'label_2')
    return {
      rows: ordered,
      photos: ordered,
      originalPhotos: ordered,
    }
  },
  data() {
    return {
      fuse: false,
      filter: '',
      photos: '',
      originalPhotos: '',
      filteredPhotos: [],
      results: [],
      fuseOptions: {
        include: ['score', 'matches'],
        shouldSort: true,
        threshold: 0.1,
        location: 0,
        distance: 20,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ['label_2', 'plant_id_2', 'filename'],
      },
    }
  },

  computed: {
    byLabel() {
      return groupBy(this.getPhotos, 'label_2')
    },
    getPhotos() {
      this.photos = this.copyObj(this.originalPhotos)
      return this.filteredPhotos.length ? this.filteredPhotos : this.photos
    },
  },
  methods: {
    search() {
      this.photos = this.copyObj(this.originalPhotos)
      const results = new Fuse(this.photos, this.fuseOptions).search(
        this.filter
      )
      this.filteredPhotos = results.map((item) => item.item)
    },
    clear() {
      this.filter = ''
      this.search()
    },
    group(items, key) {
      return groupBy(sortBy(items, ['age']), key)
    },
    publicId(filename) {
      return 'samples/' + filename
    },
    namespace(object, path) {
      return path.split('.').reduce((value, index) => {
        return value[index]
      }, object)
    },
    copyObj(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
  },
}
</script>

<style>
.cld-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
