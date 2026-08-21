import { getCourses } from '@/lib/courses';
import CourseGrid from '@/components/CourseGrid';
import styles from './page.module.css';

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Teaching</p>
        <h1 className={styles.heading}>Courses</h1>
        <p className={styles.intro}>Courses taught by members of the group. Select one to see the full breakdown.</p>
      </header>

      <CourseGrid courses={courses} />
    </main>
  );
}