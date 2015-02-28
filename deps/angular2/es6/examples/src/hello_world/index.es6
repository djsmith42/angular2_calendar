import * as app from './index_common';
import {reflector} from 'angular2/src/reflection/reflection';
import {ReflectionCapabilities} from 'angular2/src/reflection/reflection_capabilities';
export function main() {
  reflector.reflectionCapabilities = new ReflectionCapabilities();
  app.main();
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/examples/src/hello_world/index.map

//# sourceMappingURL=./index.map