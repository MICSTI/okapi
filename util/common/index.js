const lookupObjectPathValue = (obj, path) => {
  if (typeof obj !== 'object') {
    throw new Error("First argument must be an object");
  }

  // this means that both "" and "/" return the root data object as is
  const pathArr = path.split("/").filter(val => val.trim() !== "");

  let curr = obj;
  while (pathArr.length > 0) {
    const next = pathArr.shift();

    curr = curr[next];

    if (!curr) {
      throw new Error(`Missing path element '${next}'`);
    }
  }

  return curr;
};

const lookupArrayElementIdx = (arr, prop, value) => {
  if (!Array.isArray(arr)) {
    throw Error("First argument must be an array");
  }

  for (const [idx, elem] of arr.entries()) {
    if (elem[prop] === value) {
      return idx;
    }
  }

  return -1;
};

module.exports = {
  lookupArrayElementIdx,
  lookupObjectPathValue,
}
