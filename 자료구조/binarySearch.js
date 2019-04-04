const binarySearch = (arrayData, first, last, target) => {
  if (first > last) {
    return -1;
  }

  const middle = Number((first + last) / 2).toFixed();

  if(arrayData[middle] === target) {
    return middle;
  } else if (target < arrayData[middle]) {
    return binarySearch(arrayData, first, Number(middle) - 1, target);
  } else {
    return binarySearch(arrayData, Number(middle) + 1, last, target);
  }
};

const idx = binarySearch([1,3,5,7,9], 0, [1,3,5,7,9].length-1, 3);

if (idx === -1) {
  console.log('탐색 실패');
} else {
  console.log(`타겟 저장 인덱스: ${idx}`);
}
