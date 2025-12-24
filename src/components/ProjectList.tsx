import { useState, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import GlassIndicator from './GlassIndicator';
import ProjectImage from './ProjectImage';
import ProjectItem from './ProjectItem';

interface Project {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

interface ProjectListProps {
  projects: Project[];
}

const ProjectList = ({ projects }: ProjectListProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const currentProject = hoveredIndex !== null ? projects[hoveredIndex] : null;

  const getIndicatorStyle = () => {
    if (hoveredIndex === null || !listRef.current) return {};
    const item = itemRefs.current[hoveredIndex];
    if (!item) return {};

    const listRect = listRef.current.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    return {
      top: itemRect.top - listRect.top,
      left: itemRect.left - listRect.left,
      width: itemRect.width,
      height: itemRect.height,
    };
  };

  return (
    <div className='flex gap-16 items-center'>
      <ul
        ref={listRef}
        className='relative flex-1 max-w-md space-y-1'
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <AnimatePresence>
          {hoveredIndex !== null && (
            <GlassIndicator style={getIndicatorStyle()} />
          )}
        </AnimatePresence>
        {projects.map((project, index) => (
          <ProjectItem
            key={project.title}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            project={project}
            onMouseEnter={() => setHoveredIndex(index)}
          />
        ))}
      </ul>

      <div className='hidden sm:flex flex-1 items-center justify-center min-h-[300px]'>
        <AnimatePresence mode='wait'>
          {currentProject?.image && (
            <ProjectImage
              key={currentProject.title}
              src={currentProject.image}
              alt={currentProject.title}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectList;
