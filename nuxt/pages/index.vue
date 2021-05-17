<template>
  <ais-instant-search
    :search-client="searchClient"
    index-name="samples"
    class="bg-white"
  >
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-12 gap-0 min-h-screen">
        <div class="col-span-3 bg-white py-8 px-8 divide-y">
          <div class="py-8">
            <div class="relative">
              Search:
              <ais-search-box />
            </div>
            <div>
              <ais-powered-by class="mt-4" />
            </div>
          </div>
          <div class="py-8 space-y-2">
            <h3 class="font-bold">Label</h3>
            <ais-refinement-list
              attribute="label_2"
              :searchable="true"
              searchable-placeholder="search for label"
              show-more
              :sort-by="['isRefined', 'name:asc']"
            />
          </div>
          <div class="py-8 space-y-2">
            <h3 class="font-bold">Plant_id</h3>
            <ais-refinement-list
              attribute="plant_id_2"
              :searchable="true"
              searchable-placeholder="search for plant_id"
              show-more
              :sort-by="['isRefined', 'name:asc']"
            />
          </div>
          <div class="py-8 space-y-2">
            <h3 class="font-bold">Age</h3>
            <ais-range-input attribute="age"> </ais-range-input>
          </div>
          <!-- <div class="py-8 space-y-2">
            <h3 class="font-bold">Age</h3>
            <ais-refinement-list
              attribute="age"
              :searchable="true"
              searchable-placeholder="search for age"
              show-more
              :sort-by="['isRefined', 'name:asc']"
            />
          </div> -->
        </div>
        <div class="col-span-9 bg-white">
          <ais-hits class="z-10 relative py-8 bg-gray-100">
            <ul
              slot-scope="{ items }"
              class="grid grid-cols-3 gap-4 md:gap-6 px-8 md:px-12"
            >
              <li v-for="item in items" :key="item.objectID">
                <div
                  class="flex flex-col overflow-hidden rounded-lg shadow-sm relative"
                  style="padding-top: 100%"
                >
                  <cld-image
                    :public-id="publicId(item.filename)"
                    :alt="item._id"
                    responsive
                    loading="lazy"
                    class="w-full absolute top-0 left-0 z-10"
                  >
                    <cld-placeholder type="blur" />
                  </cld-image>
                  <div
                    class="absolute top-0 left-0 text-white p-4 z-20 text-xs"
                  >
                    {{ item.label_2 }} <br />
                    {{ item.plant_id_2 }} <br />
                    {{ item.age }} days
                  </div>
                  <ul class="bg-white p-4 text-xs text-gray-800">
                    <li>
                      <span class="font-bold">Label:</span>
                      {{ item.label_2 }}
                    </li>
                    <li>
                      <span class="font-bold">Plant_id:</span>
                      {{ item.plant_id_2 }}
                    </li>
                    <li>
                      <span class="font-bold">Filename:</span>
                      {{ item.filename }}
                    </li>
                    <li>
                      <span class="font-bold">Age:</span>
                      {{ item.age }} days
                    </li>
                    <li>
                      <span class="font-bold">Planted:</span>
                      {{ $moment(item.planted_at).format('YYYY/MM/DD') }}
                    </li>
                    <li>
                      <span class="font-bold">Taken:</span>
                      {{ $moment(item.taken_at).format('YYYY/MM/DD') }}
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </ais-hits>

          <div
            class="sticky bottom-0 z-20 py-8 flex items-center justify-between bg-white"
          >
            <ais-pagination />
            <ais-hits-per-page
              :items="[
                { label: '12 hits per page', value: 12 },
                { label: '24 hits per page', value: 24 },
                { label: '60 hits per page', value: 60, default: true },
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </ais-instant-search>
</template>
<script>
import algoliasearch from 'algoliasearch/lite'
import 'instantsearch.css/themes/satellite-min.css'
// import component
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'
// import theme
import 'vue-slider-component/theme/default.css'
import { AisInstantSearch, AisSearchBox, AisHits } from 'vue-instantsearch'

export default {
  components: {
    AisInstantSearch,
    AisSearchBox,
    AisHits,
    VueSlider,
  },
  data() {
    return {
      searchClient: algoliasearch(
        'US5RIL9O8X',
        '5fb9c5f8114d46d722c4d59263876ba4'
      ),
    }
  },
  methods: {
    publicId(filename) {
      return 'samples/' + filename
    },
    toValue(value, range) {
      return [
        value.min !== null ? value.min : range.min,
        value.max !== null ? value.max : range.max,
      ]
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
