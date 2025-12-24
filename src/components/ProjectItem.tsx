import { type Ref } from 'react';

interface Project {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

interface ProjectItemProps {
  project: Project;
  onMouseEnter: () => void;
  ref?: Ref<HTMLLIElement>;
}

const ProjectItem = ({ project, onMouseEnter, ref }: ProjectItemProps) => (
  <li ref={ref} className='relative -ml-4' onMouseEnter={onMouseEnter}>
    <a
      href={project.url || '#'}
      target='_blank'
      rel='noopener noreferrer'
      className='relative block pl-4 py-3 pr-4'
    >
      <h3 className='font-medium text-foreground'>{project.title}</h3>
      <p className='text-muted text-sm mt-1'>{project.description}</p>
    </a>
  </li>
);

export default ProjectItem;
