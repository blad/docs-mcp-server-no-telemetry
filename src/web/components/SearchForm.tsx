interface SearchFormProps {
  libraries: string[];
}

/**
 * Search form for querying indexed documentation.
 * Submits via HTMX to POST /search/results and renders results below.
 */
const SearchForm = ({ libraries }: SearchFormProps) => (
  <form
    hx-post="/search/results"
    hx-target="#search-results"
    hx-swap="innerHTML"
    hx-indicator="#search-spinner"
    class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-300 dark:border-gray-600 space-y-4"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Library */}
      <div>
        <label
          for="search-library"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Library
        </label>
        <select
          id="search-library"
          name="library"
          required
          class="block w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="" disabled selected>
            Select a library…
          </option>
          {libraries.map((lib) => (
            <option value={lib} safe>
              {lib}
            </option>
          ))}
        </select>
      </div>

      {/* Version */}
      <div>
        <label
          for="search-version"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Version{" "}
          <span class="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          id="search-version"
          name="version"
          placeholder="latest"
          class="block w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>
    </div>

    {/* Query */}
    <div>
      <label
        for="search-query"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Query
      </label>
      <input
        type="text"
        id="search-query"
        name="query"
        required
        placeholder="e.g. how to configure authentication"
        class="block w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    </div>

    <div class="flex items-center gap-4">
      {/* Limit */}
      <div class="flex items-center gap-2">
        <label
          for="search-limit"
          class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
        >
          Max results
        </label>
        <input
          type="number"
          id="search-limit"
          name="limit"
          min="1"
          max="20"
          value="5"
          class="w-20 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <button
        type="submit"
        class="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-150"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Search
        <svg
          id="search-spinner"
          class="htmx-indicator w-4 h-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </button>
    </div>
  </form>
);

export default SearchForm;
