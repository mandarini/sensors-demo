/**
 * It maps a number to a range
 *
 * x is the number we want to map
 *
 * in_min - in_max is the range the numer is in
 *
 * out_min - out_max is the range we want to map the number to
 *
 * */

export function mapNumber(
  x: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
