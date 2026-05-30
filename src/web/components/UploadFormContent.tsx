/**
 * Form for uploading a local file to be indexed as documentation.
 * Submits as multipart/form-data to POST /web/jobs/upload.
 */
const UploadFormContent = () => (
  <div class="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-300 dark:border-gray-600 relative animate-[fadeSlideIn_0.2s_ease-out]">
    {/* Close button */}
    <button
      type="button"
      hx-get="/web/jobs/new-button"
      hx-target="#addJobForm"
      hx-swap="innerHTML"
      class="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
      title="Close"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 pr-8">
      Upload Documentation File
    </h3>

    <form
      hx-post="/web/jobs/upload"
      hx-encoding="multipart/form-data"
      hx-target="#addJobForm"
      hx-swap="innerHTML"
      class="space-y-4"
    >
      {/* File input */}
      <div>
        <label
          for="upload-file"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          File
        </label>
        <input
          type="file"
          name="file"
          id="upload-file"
          required
          accept=".html,.htm,.md,.markdown,.mdx,.txt,.pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.odt,.ods,.odp,.rtf,.epub,.ipynb,.rst,.zip,.tar,.gz,.tgz,.json,.yaml,.yml"
          class="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-1.5 file:px-3 file:border-0 file:rounded-md file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-gray-700 dark:file:text-gray-200 cursor-pointer"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Supported: HTML, Markdown, PDF, Word, Excel, PowerPoint, EPUB, plain text, zip/tar archives. Max 100 MB.
        </p>
      </div>

      {/* Library Name */}
      <div>
        <label
          for="upload-library"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Library Name
        </label>
        <input
          type="text"
          name="library"
          id="upload-library"
          required
          placeholder="e.g. my-docs, react, express"
          class="block w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Version */}
      <div>
        <label
          for="upload-version"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Version{" "}
          <span class="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          name="version"
          id="upload-version"
          placeholder="e.g. 2.0.0 — leave empty for latest"
          class="block w-full max-w-xs px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-150"
      >
        Upload and Index
      </button>
    </form>
  </div>
);

export default UploadFormContent;
