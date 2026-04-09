import { advantages, workflowIntro, workflowSteps } from '../../data/siteContent';
import { SectionHeading } from '../common/SectionHeading';

export function WorkflowSection() {
  return (
    <section id="workflow" className="workflow-section">
      <div className="container">
        <SectionHeading
          eyebrow="Процесс работы"
          title="Как мы работаем"
          description={workflowIntro}
          centered
          light
        />

        <div className="steps-grid">
          {workflowSteps.map((step, index) => (
            <article
              className="step-card"
              key={step.title}
              data-reveal="up"
              data-delay={index}
              style={{ ['--float-delay' as string]: `${index * 0.45}s`, ['--float-duration' as string]: `${5.4 + index * 0.35}s` }}
            >
              <div className="step-index">{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>

        <div className="advantages-grid" aria-label="Преимущества подхода">
          {advantages.map((item, index) => (
            <div className="advantage-pill" key={item} data-reveal="zoom" data-delay={index}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
