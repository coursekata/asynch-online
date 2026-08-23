// ─────────────────────────────────────────────────────────────────────────────
// Teaching-resource taxonomy
//
// These two lists drive the **Books** and **Chapter** dropdowns shown in the
// Studio editor for each resource — and the matching filters on the public
// /resources page.
//
// ✏️  TO ADD OR REMOVE AN OPTION (safe to edit in Studio):
//     Add or delete a line inside one of the arrays below, e.g.  'Ch. 13',
//     Keep every value wrapped in single quotes and end the line with a comma.
//     Do not touch the `as const` at the end of each array.
//
// Publishing your change commits it and triggers a rebuild; once that finishes,
// the new option appears in the editor dropdowns and the public filters.
// ─────────────────────────────────────────────────────────────────────────────

/** Book codes a resource can be tagged with. */
export const BOOK_CODES = ['AB', 'ABC', 'ABCD', 'XCD'] as const;

/** Chapters a resource can be assigned to. */
export const CHAPTERS = [
  'Ch. 1',
  'Ch. 2',
  'Ch. 3',
  'Ch. 4',
  'Ch. 5',
  'Ch. 6',
  'Ch. 7',
  'Ch. 8',
  'Ch. 9',
  'Ch. 10',
  'Ch. 11',
  'Ch. 12',
] as const;

export type BookCode = (typeof BOOK_CODES)[number];
export type Chapter = (typeof CHAPTERS)[number];
