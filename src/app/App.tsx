import { type FormEvent, useEffect, useState } from 'react';

import { CustomCursor } from './components/common/CustomCursor';
import { Modal } from './components/common/Modal';
import { ProfileModalContent } from './components/common/ProfileModalContent';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { DepartmentsSection } from './components/sections/DepartmentsSection';
import { HeroSection } from './components/sections/HeroSection';
import { JoinSection } from './components/sections/JoinSection';
import { WorkflowSection } from './components/sections/WorkflowSection';
import { chairProfile, chairResponsibilities, initialFormState } from './data/siteContent';
import { useRevealOnScroll } from './hooks/useRevealOnScroll';
import { initAnalytics, trackEvent, trackPageView } from './lib/analytics';
import { submitJoinForm, validateJoinForm } from './lib/forms';
import { applyRuntimeSeo } from './lib/seo';
import type { Department, FormState, SectionId } from './types';

type ModalState =
  | { type: 'chair'; originRect: DOMRect }
  | { type: 'department'; department: Department; originRect: DOMRect }
  | null;

function App() {
  const [modalState, setModalState] = useState<ModalState>(null);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useRevealOnScroll();

  useEffect(() => {
    applyRuntimeSeo();
    initAnalytics();
    trackPageView();
  }, []);

  const scrollToSection = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData((previousState) => ({ ...previousState, [field]: value }));
    setSubmitMessage('');
  };

  const openChairModal = (originRect: DOMRect) => {
    trackEvent('cta_click', { placement: 'hero', target: 'chair_modal' });
    setModalState({ type: 'chair', originRect });
  };

  const openDepartmentModal = (department: Department, originRect: DOMRect) => {
    trackEvent('department_modal_open', { department: department.key });
    setModalState({ type: 'department', department, originRect });
  };

  const handleJoinClick = () => {
    trackEvent('cta_click', { placement: 'hero', target: 'join_form' });
    scrollToSection('contact');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResult = validateJoinForm(formData);
    setSubmitMessage(validationResult.message);

    if (!validationResult.isValid) {
      trackEvent('join_form_validation_error');
      return;
    }

    setIsSubmitting(true);

    try {
      trackEvent('join_form_submit', {
        department: formData.department || 'not_selected',
        has_telegram: Boolean(formData.telegram.trim()),
      });

      const submitResult = await submitJoinForm(formData);
      setSubmitMessage(submitResult.message);

      if (submitResult.isValid) {
        trackEvent('join_form_success', { department: formData.department || 'not_selected' });
        setFormData(initialFormState);
      } else {
        trackEvent('join_form_submit_error');
      }
    } catch (error) {
      console.error(error);
      setSubmitMessage('Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.');
      trackEvent('join_form_submit_error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <CustomCursor />
      <Header onNavigate={scrollToSection} />

      <main id="top">
        <HeroSection onJoinClick={handleJoinClick} onChairClick={openChairModal} />
        <WorkflowSection />
        <DepartmentsSection onOpenDepartment={openDepartmentModal} />
        <JoinSection
          formData={formData}
          submitMessage={submitMessage}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onFieldChange={updateField}
        />
      </main>

      <Footer />

      {modalState?.type === 'chair' && (
        <Modal title={chairProfile.role} originRect={modalState.originRect} onClose={() => setModalState(null)}>
          <ProfileModalContent
            profile={chairProfile}
            description="Председатель ИТС КИПФИН координирует все направления работы, поддерживает участников и помогает командам двигаться в одном ритме — от идеи до финального результата."
            listTitle="Зона ответственности"
            list={chairResponsibilities}
          />
        </Modal>
      )}

      {modalState?.type === 'department' && (
        <Modal title={modalState.department.lead.role} originRect={modalState.originRect} onClose={() => setModalState(null)}>
          <ProfileModalContent
            profile={modalState.department.lead}
            description={modalState.department.about}
            listTitle="Основные направления отдела"
            list={modalState.department.directions}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
