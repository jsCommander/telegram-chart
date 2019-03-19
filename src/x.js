

for (let index = 0; index < array.length; index++) {
  const element = array[index];
  console.log(element)
}


for (const key in array) {
  if (object.hasOwnProperty(key)) {
    const element = object[key];
    console.log(element)
  }
}


for (const element of array) {
  console.log(element)
}


array.map(element => console.log(element))


