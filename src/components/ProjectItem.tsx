import { type Ref } from "react";

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
  <li ref={ref} className="relative -ml-4 group" onMouseEnter={onMouseEnter}>
    <a
      href={project.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block m-0 pl-4 py-2 pr-4"
    >
      <h3 className="font-normal text-foreground group-hover:text-muted transition-colors">
        {project.title}
      </h3>
      <p className="text-muted mt-1">{project.description}</p>
      <span className="sr-only">(opens in new tab)</span>
    </a>
  </li>
);

export default ProjectItem;
