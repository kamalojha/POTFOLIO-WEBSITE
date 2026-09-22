import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { EducationSection } from './components/EducationSection';
import { CertificationsSection } from './components/CertificationsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectDeepDiveModal } from './components/ProjectDeepDiveModal';
import { ResumeModal } from './components/ResumeModal';
import { Project } from './types/portfolio';

export function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const handleOpenContact = () => {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreProjects = () => {
    const projectsElem = document.getElementById('projects');
    if (projectsElem) {
      projectsElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-[#e2e8f0] flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* 3-Zone Strict Top Bar Navigation */}
      <Navbar
        onOpenResume={() => setIsResumeModalOpen(true)}
        onOpenContact={handleOpenContact}
      />

      <main className="flex-1">
        {/* Split Hero Section */}
        <Hero
          onOpenResume={() => setIsResumeModalOpen(true)}
          onOpenContact={handleOpenContact}
          onExploreProjects={handleExploreProjects}
        />

        {/* 01. Featured Projects with Interactive Simulators */}
        <ProjectsSection onSelectProject={(project) => setSelectedProject(project)} />

        {/* 02. Technical Capabilities & Stack */}
        <SkillsSection />

        {/* 03. Internships & Professional Training */}
        <ExperienceTimeline />

        {/* 04. Education & Academic Pedigree */}
        <EducationSection />

        {/* 05. Certifications & Accolades */}
        <CertificationsSection />

        {/* 06. Inbound Contact & Direct Inquiries */}
        <ContactSection />
      </main>

      {/* Clean Minimalist Footer */}
      <Footer />

      {/* Project Deep Dive & Interactive Simulator Modal */}
      <ProjectDeepDiveModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Full Resume Dossier Sheet Modal */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}

export default App;
