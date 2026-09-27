import React from 'react';
import { Project } from '../types/portfolio';
import { ProjectBlogView } from './ProjectBlogView';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  allProjects: Project[];
  onNavigateProject: (project: Project) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  allProjects,
  onNavigateProject,
}) => {
  if (!project) return null;

  return (
    <ProjectBlogView
      project={project}
      onClose={onClose}
      allProjects={allProjects}
      onNavigateProject={onNavigateProject}
    />
  );
};
