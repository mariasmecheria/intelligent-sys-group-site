import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseBySlug, titleCase } from '@/lib/courses';
import styles from './page.module.css';

function buildStatusSentence(course: {
  isCompulsory: boolean;
  studyYear?: string;
  faculty?: string;
  semester?: string;
}): string {
  const kind = course.isCompulsory ? 'Compulsory course' : 'Elective course';
  const year = course.studyYear ? ` for ${titleCase(course.studyYear)} students` : '';
  const faculty = course.faculty ? ` of the Faculty of ${course.faculty}` : '';
  const semester = course.semester ? ` Offered in ${course.semester}.` : '';

  return `${kind}${year}${faculty}.${semester}`;
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const hasPrerequisites =
    course.prerequisites && course.prerequisites.trim().toLowerCase() !== 'none' && course.prerequisites.trim() !== '';

  return (
    <main className={styles.page}>
      {course.coverPictureUrl && (
        <div className={styles.banner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={course.coverPictureUrl} alt="" className={styles.bannerImage} />
        </div>
      )}

      <div className={styles.container}>
        <Link href="/courses" className={`${styles.backLink} ${styles.animateIn} ${styles.delay1}`}>
          ← All courses
        </Link>

        <div className={`${styles.headerRow} ${styles.animateIn} ${styles.delay2}`}>
          {course.type && <span className={styles.typeTag}>{titleCase(course.type)}</span>}
        </div>

        <h1 className={`${styles.title} ${styles.animateIn} ${styles.delay2}`}>{course.courseName}</h1>

        <p className={`${styles.statusLine} ${styles.animateIn} ${styles.delay3}`}>{buildStatusSentence(course)}</p>

        {course.team_members.length > 0 ? (
          <p className={`${styles.instructorLine} ${styles.animateIn} ${styles.delay3}`}>
            {course.team_members.length > 1 ? 'Instructors: ' : 'Instructor: '}
            {course.team_members.map((member, i) => (
              <span key={member.id}>
                <Link href={`/people/${member.slug}`} className={styles.instructorLink}>
                  {member.fullName}
                </Link>
                {i < course.team_members.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        ) : (
          course.instructor && (
            <p className={`${styles.instructorLine} ${styles.animateIn} ${styles.delay3}`}>
              Instructor: {course.instructor}
            </p>
          )
        )}

        {hasPrerequisites && (
          <p className={`${styles.prerequisites} ${styles.animateIn} ${styles.delay4}`}>
            Prerequisites: {course.prerequisites}
          </p>
        )}

        {course.content.length > 0 && (
          <section className={`${styles.section} ${styles.animateIn} ${styles.delay4}`}>
            <h2 className={styles.sectionHeading}>Course content</h2>
            <div className={styles.contentBlocks}>
              {course.content.map((block) => (
                <div key={block.id}>
                  <h3 className={styles.contentTitle}>{block.title}</h3>
                  {block.content && <p className={styles.body}>{block.content}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {course.mainBibliography.length > 0 && (
          <section className={`${styles.section} ${styles.animateIn} ${styles.delay5}`}>
            <h2 className={styles.sectionHeading}>Main bibliography</h2>
            <ol className={styles.bibList}>
              {course.mainBibliography.map((entry) => (
                <li key={entry.id} className={styles.bibEntry}>
                  {entry.citation}
                </li>
              ))}
            </ol>
          </section>
        )}

        {course.additionalBibliography.length > 0 && (
          <section className={`${styles.section} ${styles.animateIn} ${styles.delay5}`}>
            <h2 className={styles.sectionHeading}>Additional bibliography</h2>
            <ol className={styles.bibList}>
              {course.additionalBibliography.map((entry) => (
                <li key={entry.id} className={styles.bibEntry}>
                  {entry.citation}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </main>
  );
}