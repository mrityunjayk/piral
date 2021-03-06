import type {
  PiletRequester,
  PiletDependencyFetcher,
  PiletDependencyGetter,
  PiletLoadingStrategy,
  PiletLoader,
  Pilet,
  AvailableDependencies,
} from 'piral-base';
import type { NestedPartial } from './common';
import type { PiralPlugin } from './plugin';
import type { GlobalState, PiralDefineActions } from './state';

export { PiletLoadingStrategy, PiletDependencyFetcher, PiletDependencyGetter, PiletRequester, AvailableDependencies };

/**
 * The configuration for loading the pilets of the Piral instance.
 */
export interface PiralPiletConfiguration {
  /**
   * The callback for defining how a dependency will be fetched.
   */
  fetchDependency?: PiletDependencyFetcher;
  /**
   * Function to get the dependencies for a given module.
   */
  getDependencies?: PiletDependencyGetter;
  /**
   * Function to load the modules asynchronously, e.g., from a server 🚚.
   */
  requestPilets?: PiletRequester;
  /**
   * Function to define how to load a pilet given its metadata.
   */
  loadPilet?: PiletLoader;
  /**
   * Determines that pilets are loaded asynchronously, essentially showing the
   * app right away without waiting for the pilets to load and evaluate.
   */
  async?: boolean | PiletLoadingStrategy;
  /**
   * Determines the modules, which are available already from the start 🚀.
   * The given modules are all already evaluated.
   * This can be used for customization or for debugging purposes.
   */
  availablePilets?: Array<Pilet>;
  /**
   * Optionally provides a function to extend the API creator with some additional
   * functionality.
   * @deprecated Use plugins instead.
   */
  extendApi?: PiralPlugin | Array<PiralPlugin>;
  /**
   * Extends the Piral instance with additional capabilities.
   */
  plugins?: PiralPlugin | Array<PiralPlugin>;
}

/**
 * The initial configuration of Piral's state container.
 */
export interface PiralStateConfiguration {
  /**
   * Optionally, sets up the initial state of the application 📦.
   */
  state?: NestedPartial<GlobalState>;
  /**
   * Optionally, sets up some initial custom actions ⚡️.
   */
  actions?: PiralDefineActions;
}

/**
 * The configuration to be used in the Piral instance.
 */
export type PiralConfiguration = PiralPiletConfiguration & PiralStateConfiguration;
