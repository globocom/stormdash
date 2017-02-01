function uuid() {
  var i, random;
  var uuid = '';

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
      .toString(16);
  }

  return uuid;
}

function shuffle(array) {
  // Fisher–Yates shuffle
  var m = array.length, t, i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function store(namespace, data) {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }

  var store = localStorage.getItem(namespace);
  return (store && JSON.parse(store)) || [];
}

function traverse(obj, func) {
  for (var i in obj) {
    func.apply(this, [i, obj[i]]);
    if (obj[i] !== null && typeof(obj[i]) == "object") {
      traverse(obj[i],func);
    }
  }
}

export { uuid, shuffle, store, traverse };
