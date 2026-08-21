import Link from 'next/link';
import type { CourseListItem } from '@/lib/courses';
import { titleCase } from '@/lib/courses';
import styles from './CourseGrid.module.css';

export default function CourseGrid({ courses }: { courses: CourseListItem[] }) {
  if (courses.length === 0) {
    return <p className={styles.empty}>No courses listed yet.</p>;
  }

  return (
    <div className={styles.stack}>
      {courses.map((course) => (
        <Link key={course.id} href={`/courses/${course.slug}`} className={styles.banner}>
          {course.coverPictureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={course.coverPictureUrl} alt="" className={styles.image} />
          ) : (
            <div className={styles.imageFallback} aria-hidden="true">
              {course.courseName?.[0] ?? '?'}
            </div>
          )}

          <div className={styles.overlay} />

          <div className={styles.content}>
            {course.type && <span className={styles.typeTag}>{titleCase(course.type)}</span>}
            <h2 className={styles.title}>{course.courseName}</h2>
            <span className={styles.cta}>Explore →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}