import { type MouseEvent } from 'react';

import { departments } from '../../data/siteContent';
import type { Department } from '../../types';
import { SectionHeading } from '../common/SectionHeading';

type DepartmentsSectionProps = {
  onOpenDepartment: (department: Department, originRect: DOMRect) => void;
};

export function DepartmentsSection({ onOpenDepartment }: DepartmentsSectionProps) {
  const handleOpen = (department: Department) => (event: MouseEvent<HTMLButtonElement>) => {
    onOpenDepartment(department, event.currentTarget.getBoundingClientRect());
  };

  return (
    <section id="departments" className="departments-section">
      <div className="container">
        <SectionHeading
          eyebrow="Команда"
          title="Отделы ИТС"
          description="У каждого направления своя роль, но все вместе они работают над общим результатом и усиливают друг друга в одном проектном цикле."
          centered
        />

        <div className="departments-list">
          {departments.map((department, index) => (
            <article className="department-card" key={department.key} data-reveal={index % 2 === 0 ? 'left' : 'right'} data-delay={index}>
              <div className="department-media">
                <img src={department.image} alt={department.title} />
              </div>

              <div className="department-body">
                <div className="department-copy-block">
                  <div>
                    <h3>{department.title}</h3>
                    <p className="department-subtitle">{department.subtitle}</p>
                  </div>

                  <p className="department-about">{department.about}</p>
                </div>

                <div className="department-lead-card">
                  <span className="department-lead-label">Руководитель направления</span>
                  <strong>{department.lead.name}</strong>
                  <span>{department.lead.role}</span>
                </div>

                <div>
                  <p className="department-label">Направления работы</p>
                  <ul className="department-list">
                    {department.directions.map((direction) => (
                      <li key={direction}>{direction}</li>
                    ))}
                  </ul>
                </div>

                <button className="primary-button small-button morph-trigger" type="button" onClick={handleOpen(department)}>
                  Руководитель отдела
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
