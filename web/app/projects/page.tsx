import { getProjects, parseKeywords } from '@/lib/projects';
import styles from './page.module.css';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Research</p>
        <h1 className={styles.heading}>Projects</h1>
        <p className={styles.intro}>Research projects carried out by the group.</p>
      </header>

      <div className={styles.container}>
        {projects.length === 0 ? (
          <p className={styles.empty}>No projects listed yet.</p>
        ) : (
          <ul className={styles.projectList}>
            {projects.map((project) => {
              const keywords = parseKeywords(project.keywords);

              return (
                <li key={project.id} className={styles.projectEntry}>
                  <h2 className={styles.projectTitle}>
                    {project.link ? (
                      <a
                        href={project.link.href}
                        target={project.link.external ? '_blank' : undefined}
                        rel={project.link.external ? 'noopener noreferrer' : undefined}
                      >
                        {project.acronym}
                      </a>
                    ) : (
                      project.acronym
                    )}
                  </h2>

                  <p className={styles.projectDescription}>{project.title}</p>

                  {keywords.length > 0 && (
                    <div className={styles.keywords}>
                      {keywords.map((kw) => (
                        <span key={kw} className={styles.keyword}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}