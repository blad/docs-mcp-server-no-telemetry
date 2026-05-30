import type { AppConfig } from "../../utils/config";
import ScrapeFormContent from "./ScrapeFormContent";
import UploadFormContent from "./UploadFormContent";

interface AddJobTabsProps {
  defaultExcludePatterns?: string[];
  scraperConfig?: AppConfig["scraper"];
}

/**
 * Tab switcher for the "Add New Documentation" panel.
 * Renders a URL-based scrape tab and a file upload tab side by side.
 */
const AddJobTabs = ({ defaultExcludePatterns, scraperConfig }: AddJobTabsProps) => (
  <div x-data="{ tab: 'url' }" class="animate-[fadeSlideIn_0.2s_ease-out]">
    {/* Tab bar */}
    <div class="flex border-b border-gray-200 dark:border-gray-700">
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors duration-150"
        x-bind:class="tab === 'url'
          ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
        x-on:click="tab = 'url'"
      >
        URL
      </button>
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors duration-150"
        x-bind:class="tab === 'upload'
          ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
        x-on:click="tab = 'upload'"
      >
        Upload File
      </button>
    </div>

    <div x-show="tab === 'url'" x-cloak>
      <ScrapeFormContent
        defaultExcludePatterns={defaultExcludePatterns}
        scraperConfig={scraperConfig}
      />
    </div>

    <div x-show="tab === 'upload'" x-cloak>
      <UploadFormContent />
    </div>
  </div>
);

export default AddJobTabs;
