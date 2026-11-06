import { books } from './booksData'
import { courses } from './coursesData'
import { catalogIdFor } from '../lib/catalog'

// Everything the Shop lists, derived from booksData and coursesData so a new product is added in one place.
// Each entry is shaped as ProductCard props plus `kind` ('book' | 'course') and the server `catalogId`.
export function buildShopItems() {
  const bookItems = books.map((book) => ({
    key: `book-${book.id}`,
    kind: 'book',
    catalogId: catalogIdFor(book),
    to: `/books/${book.id}`,
    cover: book.cover,
    label: book.numberLabel,
    title: book.title,
    subtitle: book.subtitle,
    comingSoon: !book.description,
  }))
  const courseItems = courses.map((course) => ({
    key: `course-${course.slug}`,
    kind: 'course',
    catalogId: catalogIdFor(course),
    to: `/courses/${course.slug}`,
    cover: course.cover,
    label: course.label,
    title: course.title,
    subtitle: course.tagline,
    comingSoon: false,
  }))
  return [...bookItems, ...courseItems]
}
