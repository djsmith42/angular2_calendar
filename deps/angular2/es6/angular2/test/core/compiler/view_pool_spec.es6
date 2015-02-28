import {describe,
  xit,
  it,
  expect,
  beforeEach,
  ddescribe,
  iit,
  el,
  proxy} from 'angular2/test_lib';
import {View} from 'angular2/src/core/compiler/view';
import {ViewPool} from 'angular2/src/core/compiler/view_pool';
import {IMPLEMENTS} from 'angular2/src/facade/lang';
class FakeView {
  noSuchMethod(i) {
    super.noSuchMethod(i);
  }
}
Object.defineProperty(FakeView, "annotations", {get: function() {
    return [new proxy, new IMPLEMENTS(View)];
  }});
export function main() {
  describe('ViewPool', () => {
    var viewPool,
        capacity = 3;
    beforeEach(() => {
      viewPool = new ViewPool(capacity);
    });
    it('should return null when there are no views', () => {
      expect(viewPool.pop()).toBeNull();
      expect(viewPool.length()).toBe(0);
    });
    it('should support storing and retrieving a view', () => {
      var view = new FakeView();
      viewPool.push(view);
      expect(viewPool.length()).toBe(1);
      expect(viewPool.pop()).toBe(view);
      expect(viewPool.length()).toBe(0);
    });
    it('should not store more views that its capacity', () => {
      for (var i = 0; i < capacity * 2; i++)
        viewPool.push(new FakeView());
      expect(viewPool.length()).toBe(capacity);
      for (var i = 0; i < capacity; i++) {
        expect(viewPool.pop()).not.toBe(null);
      }
      expect(viewPool.pop()).toBeNull();
    });
  });
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/test/core/compiler/view_pool_spec.map

//# sourceMappingURL=./view_pool_spec.map