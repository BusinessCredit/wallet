export function readStorage(key, callback, err){
  storage
  .load({
    key: key
  })
  .then((res) => {
    callback(res)
  })
  .catch((e) => {
    err(e);
  });
}

export function writeStorage(key, value, err){
  storage.save({
    key: key,
    data: value,
    expires: null
  }).catch(e => err(e))
}