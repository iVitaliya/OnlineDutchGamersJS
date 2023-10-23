export class FormatArray {
  public trim(arr: (string | any)[], maxLength: number = 10): (string | any)[] {
    if (arr.length > maxLength) {
      const length = arr.length - maxLength;

      arr = arr.slice(0, maxLength);
      arr.push(`${length} more...`);
    }

    return arr;
  }

  public removeDuplicates(arr: (string | any)[]): (string | any)[] {
    return [...new Set(arr)];
  }
}
