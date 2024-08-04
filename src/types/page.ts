import { number, pipe, toMinValue } from "valibot";

export const pageIndexSchema = pipe(number(), toMinValue(1));
