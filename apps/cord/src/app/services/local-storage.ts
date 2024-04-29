const cache: any = [];

export function LocalStorage(target: object, key: string) {
  Object.defineProperty(target, key, {
    get: function () {
      const ret = JSON.parse(localStorage.getItem(key) ?? '');
      return ret ? ret.value : null;
    },
    set: function (newValue) {
      if (!cache[key]) {
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify({ value: newValue }));
        }

        cache[key] = true;
        return;
      }

      localStorage.setItem(key, JSON.stringify({ value: newValue }));
    }
  });
}
