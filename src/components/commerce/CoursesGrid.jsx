import { courses } from '../../data/coursesData'
import { useCart } from '../../context/cart-context'
import { catalogIdFor } from '../../lib/catalog'
import ProductCard from './ProductCard'
import './Commerce.css'

/** The five Maharishi Yoga Peeth courses, three per row. Buying one delivers its 3-book study set. */
export default function CoursesGrid() {
  const { catalog } = useCart()

  return (
    <section className="books-grid-section courses-section" id="courses">
      <div className="container">
        <div className="cm-section-head">
          <span className="section-label">Maharishi Yoga Peeth</span>
          <h2><span className="gradient-text">Courses</span></h2>
          <p>Each course comes as a set of three books: the syllabus, the student workbook and the teacher guide.</p>
        </div>

        <div className="books-grid courses-grid">
          {courses.map((course) => (
            <ProductCard
              key={course.slug}
              wide
              to={`/courses/${course.slug}`}
              cover={course.cover}
              label={course.label}
              title={course.title}
              subtitle={course.tagline}
              item={catalog?.byId[catalogIdFor(course)]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
