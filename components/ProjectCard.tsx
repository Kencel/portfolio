'use client';
import { ImageSlot } from '@/components/ImageSlot';
import { AngularCard } from '@/components/AngularCard';
import { HoverQuad } from '@/components/ui/HoverQuad';
import { COLOR, FONT } from '@/lib/tokens';
import type { Project } from '@/lib/projects';

export function ProjectCard({ project, selectedTags }: {
  project: Project;
  selectedTags: ReadonlySet<string>;
}) {
  return (
    <AngularCard seed={60 + project.id} style={{ transform: 'skewX(-1.5deg)' }}>
      <div style={{ background: COLOR.panel, overflow: 'hidden' }}>
        <div style={{ transform: 'skewX(1.5deg)' }}>
          <ImageSlot
            src={project.imageUrl ?? undefined}
            alt={project.title}
            placeholder={project.title}
            style={{ width: '100%', height: 190, display: 'block' }}
          />
          <div style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span data-testid="project-title" style={{ fontFamily: FONT.anton, fontSize: 'clamp(26px,2.6vw,36px)' }}>{project.title}</span>
              <span style={{ background: COLOR.accent, color: COLOR.base, fontFamily: FONT.bebas, letterSpacing: '.14em', padding: '2px 10px', fontSize: 15 }}>{project.year}</span>
            </div>
            <p style={{ fontFamily: FONT.oswald, fontWeight: 300, fontSize: 17, lineHeight: 1.5, opacity: .9, margin: '10px 0 14px' }}>
              {project.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: project.linkUrl ? 16 : 0 }}>
              {project.tags.map(tag => {
                const on = selectedTags.has(tag);
                return (
                  <span key={tag} style={{ border: `1px solid ${on ? COLOR.accent : COLOR.tagBorder}`, color: on ? COLOR.accent : COLOR.ink, fontFamily: FONT.bebas, letterSpacing: '.1em', padding: '2px 9px', fontSize: 14 }}>
                    {tag}
                  </span>
                );
              })}
            </div>
            {project.linkUrl && (
              <HoverQuad seed={60 + project.id} style={{ display: 'inline-block' }}>
                <a href={project.linkUrl} target="_blank" rel="noopener noreferrer"
                   style={{ display: 'inline-block', background: COLOR.ink, color: COLOR.base, fontFamily: FONT.bebas, letterSpacing: '.14em', padding: '8px 18px', textDecoration: 'none', fontSize: 17 }}>
                  VISIT SITE ►
                </a>
              </HoverQuad>
            )}
          </div>
        </div>
      </div>
    </AngularCard>
  );
}
