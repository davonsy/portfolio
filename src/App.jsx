import { useEffect, useMemo, useRef, useState } from 'react';
import { compareProjectsByYearAndTitle, folderProjects, hasFolderProjects } from './projectCatalog';

const defaultProjects = [
  {
    label: 'GRAPHIC DESIGN',
    category: 'graphic',
    path: '/graphic-design',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop',
    className: 'item-2',
  },
  {
    label: 'MOTION GRAPHIC',
    category: 'motion',
    path: '/motion-graphic',
    image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2000&auto=format&fit=crop',
    className: 'item-1',
  },
  {
    label: '3D & VFX',
    category: 'three',
    path: '/3d-vfx',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop',
    className: 'item-3',
  },
  {
    label: 'FILM & PHOTOGRAPHY',
    category: 'film',
    path: '/film-photography',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop',
    className: 'item-4',
  },
];

const pageMeta = {
  '/': { title: 'HOME', type: 'home', category: 'featured' },
  '/graphic-design': { title: 'GRAPHIC DESIGN', type: 'graphic', category: 'graphic' },
  '/motion-graphic': { title: 'MOTION GRAPHIC', type: 'motion', category: 'motion' },
  '/3d-vfx': { title: '3D & VFX', type: 'three', category: 'three' },
  '/film-photography': { title: 'FILM & PHOTOGRAPHY', type: 'film', category: 'film' },
  '/about-contact': { title: 'ABOUT / CONTACT', type: 'about', category: 'about' },
};

const legacyProjectCatalog = [
  {
    category: 'graphic',
    title: 'IDENTITY SYSTEM',
    slug: 'identity-system',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'graphic',
    title: 'POSTER INDEX',
    slug: 'poster-index',
    image: 'https://images.unsplash.com/photo-1493421419110-74f4e85ba126?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'graphic',
    title: 'TYPOGRAPHIC STUDY',
    slug: 'typographic-study',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'graphic',
    title: 'EDITORIAL GRID',
    slug: 'editorial-grid',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'motion',
    title: 'TITLE SEQUENCE',
    slug: 'title-sequence',
    image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'motion',
    title: 'LOOP STUDY',
    slug: 'loop-study',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'motion',
    title: 'SIGNAL PACKAGE',
    slug: 'signal-package',
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'motion',
    title: 'KINETIC TYPE',
    slug: 'kinetic-type',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'three',
    title: 'OBJECT SCAN',
    slug: 'object-scan',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'three',
    title: 'LIGHT FIELD',
    slug: 'light-field',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'three',
    title: 'SIMULATION TEST',
    slug: 'simulation-test',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'three',
    title: 'RENDER PASS',
    slug: 'render-pass',
    image: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'film',
    title: 'SHORT FILM',
    slug: 'short-film',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'film',
    title: 'STILL SEQUENCE',
    slug: 'still-sequence',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'film',
    title: 'LOCATION STUDY',
    slug: 'location-study',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop',
  },
  {
    category: 'film',
    title: 'COLOR TEST',
    slug: 'color-test',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
  },
].map((project) => ({
  ...project,
  categories: project.categories || [project.category],
  categoryLabels: project.categoryLabels || [(project.categoryLabel || project.category).toUpperCase()],
  categoryLabel: project.categoryLabel || project.category.toUpperCase(),
  path: `/projects/${project.slug}`,
}));

const vibrantColors = ['#90e06d', '#f7d147', '#ff4fd8', '#44d7ff', '#ff5a3d', '#b78cff', '#ffffff'];
const cursorSymbols = ['☆', '✧', '⚡', '♧'];
const layoutSlots = [
  { anchor: 'top-left', x: [4, 10], y: [18, 28] },
  { anchor: 'top-right', x: [4, 10], y: [30, 42] },
  { anchor: 'bottom-left', x: [8, 18], y: [12, 22] },
  { anchor: 'bottom-right', x: [4, 10], y: [10, 20] },
];

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const lerp = (start, end, progress) => start + (end - start) * progress;
const easeOutQuart = (value) => 1 - Math.pow(1 - value, 4);
const easeInOutCubic = (value) => (value < 0.5 ? 4 * value ** 3 : 1 - Math.pow(-2 * value + 2, 3) / 2);
const isVideoSource = (src = '') => /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
const isYouTubeSource = (src = '') => /(?:youtube\.com\/watch\?|youtu\.be\/|youtube\.com\/embed\/)/i.test(src);

function getYouTubeId(src = '') {
  try {
    const url = new URL(src);
    if (url.hostname.includes('youtu.be')) return url.pathname.replace('/', '');
    if (url.pathname.includes('/embed/')) return url.pathname.split('/embed/')[1]?.split('/')[0] || '';
    return url.searchParams.get('v') || '';
  } catch {
    return '';
  }
}

function getYouTubeEmbedUrl(src = '', active = true) {
  const videoId = getYouTubeId(src);
  if (!videoId) return src;
  const params = new URLSearchParams({
    autoplay: active ? '1' : '0',
    mute: '1',
    loop: '1',
    playlist: videoId,
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function YouTubeFrame({ src, title = 'Project video', active = true }) {
  return (
    <iframe
      src={getYouTubeEmbedUrl(src, active)}
      title={title}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
}

function getProjectPreview(project) {
  const previewVideo = project?.previewVideo || project?.hero || project?.videos?.[0] || '';
  if (isVideoSource(previewVideo)) {
    return {
      poster: project.thumbnail || project.image || project.images?.[0] || '',
      src: previewVideo,
      type: 'video',
    };
  }
  if (isYouTubeSource(previewVideo)) {
    return {
      poster: project.thumbnail || project.image || project.images?.[0] || '',
      src: previewVideo,
      type: 'youtube',
    };
  }

  const previewImage = project?.thumbnail || project?.image || project?.images?.[0] || '';
  return {
    poster: previewImage,
    src: previewImage,
    type: 'image',
  };
}

function projectHasCategory(project, category) {
  return (project.categories || [project.category]).includes(category);
}

function useGmtClock() {
  const [time, setTime] = useState('00:00:00');
  const [timeZoneLabel, setTimeZoneLabel] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      const zoneParts = new Intl.DateTimeFormat(undefined, {
        timeZoneName: 'short',
      }).formatToParts(now);
      const shortZone = zoneParts.find((part) => part.type === 'timeZoneName')?.value;

      setTime(timeString);
      setTimeZoneLabel(shortZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'LOCAL');
    };

    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return { time, timeZoneLabel };
}

function useViewportSize() {
  const [size, setSize] = useState({ width: 1280, height: 800 });

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

function useScrollProgress(locked) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      frame = 0;
      if (locked) {
        window.scrollTo(0, 0);
        setProgress(0);
        return;
      }

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? clamp(window.scrollY / scrollable) : 0);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [locked]);

  return progress;
}

function UtilityNav({ brandText, portfolioText, menuText, projects, socialLinks, worldwideText, onNavigate, onReplayIntro }) {
  const { time, timeZoneLabel } = useGmtClock();
  const [menuOpen, setMenuOpen] = useState(false);
  const goHome = () => {
    setMenuOpen(false);
    onNavigate('/');
  };

  return (
    <>
      <nav className={`utility-nav ${menuOpen ? 'menu-is-open' : ''}`}>
        <div className="nav-left">
          <div className="nav-left-stack">
            <button className="nav-control nav-pill nav-home-control" type="button" onClick={goHome}>
              <span>{brandText}</span>
              <span>{portfolioText}</span>
            </button>
          </div>
          <button className="nav-control nav-pill menu-toggle" type="button" onClick={() => setMenuOpen((isOpen) => !isOpen)}>
            {menuText}
          </button>
          <div className="section-menu" aria-hidden={!menuOpen}>
            {projects.map((project) => (
              <button
                key={project.label}
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate(project.path);
                }}
              >
                {project.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onNavigate('/about-contact');
              }}
            >
              ABOUT / CONTACT
            </button>
            <a href="https://davonsy-ascii.vercel.app/">ASCII Converter</a>
          </div>
        </div>
        <div className="nav-right">
          {socialLinks.map((link) => (
            <a className="nav-pill" href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </div>
      </nav>
      <button className="nav-center clock-button" type="button" onClick={onReplayIntro}>
        <span>
          {time} ({timeZoneLabel})
        </span>
        <span>{worldwideText}</span>
        <span className="davonsy-line">DAVONSY</span>
      </button>
    </>
  );
}

function randomBetween([min, max]) {
  return min + Math.random() * (max - min);
}

function createRandomLayout(projects) {
  return projects.map((project, index) => {
    const slot = layoutSlots[index];
    const horizontalValue = `${randomBetween(slot.x).toFixed(2)}%`;
    const verticalValue = `${randomBetween(slot.y).toFixed(2)}%`;
    const placement = {};

    if (slot.anchor.includes('left')) placement.left = horizontalValue;
    if (slot.anchor.includes('right')) placement.right = horizontalValue;
    if (slot.anchor.includes('top')) placement.top = verticalValue;
    if (slot.anchor.includes('bottom')) placement.bottom = verticalValue;

    return placement;
  });
}

function LoadingTerminal({ progress, label }) {
  const percentage = Math.min(100, Math.round(progress * 100));
  const gaugeStyle = { '--loading-progress': `${percentage}%` };

  return (
    <div className="loading-terminal" aria-label={`Loading ${percentage}%`}>
      <div className="loading-terminal__header">
        <span>{label}</span>
        <span>{String(percentage).padStart(3, '0')}%</span>
      </div>
      <div className="loading-terminal__gauge" style={gaugeStyle}>
        <span />
      </div>
    </div>
  );
}

function CinematicVideoDisplay({ frameProgress }) {
  const { width, height } = useViewportSize();
  const finalWidth = Math.min(width - 48, 1180, Math.max(320, (height - 170) * (16 / 9)));
  const finalHeight = finalWidth * (9 / 16);
  const frameStyle = {
    width: `${lerp(width, finalWidth, frameProgress)}px`,
    height: `${lerp(height, finalHeight, frameProgress)}px`,
    borderRadius: `${lerp(0, 22, frameProgress)}px`,
    padding: `${lerp(0, 10, frameProgress)}px`,
    transform: `translate3d(0, ${lerp(0, 18, frameProgress)}px, 0)`,
  };

  return (
    <div className="cinematic-video-display">
      <div className="video-frame" style={frameStyle}>
        <MatrixRain className="matrix-rain-intro" intensity={1} progress={1} />
      </div>
    </div>
  );
}

function MatrixRain({ className = '', intensity = 0.52, progress }) {
  const canvasRef = useRef(null);
  const opacity = clamp((progress - 0.22) / 0.36) * intensity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-=<>/?';
    const palette = ['#90e06d', '#44d7ff', '#f7d147', '#ff4fd8', '#b78cff', '#ffffff'];
    let columns = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    const fontSize = className.includes('intro') ? 13 : 15;

    const resize = () => {
      const bounds = canvas.parentElement?.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      width = bounds?.width || window.innerWidth;
      height = bounds?.height || window.innerHeight;
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      columns = Array.from({ length: Math.ceil(width / fontSize) }, () => ({
        y: Math.random() * -height,
        speed: className.includes('intro') ? 0.24 + Math.random() * 0.58 : 0.16 + Math.random() * 0.38,
        colorOffset: Math.floor(Math.random() * palette.length),
        glitch: Math.random(),
      }));
    };

    const draw = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.085)';
      context.fillRect(0, 0, width, height);
      context.font = `${fontSize}px Inter, monospace`;
      context.textAlign = 'center';

      columns.forEach((column, index) => {
        const isGlitchFrame = column.glitch > 0.86 && frame % 48 < 3;
        const character = symbols[Math.floor(Math.random() * symbols.length)];
        const color = palette[(Math.floor(frame / 72) + column.colorOffset + index) % palette.length];
        const x = index * fontSize + fontSize / 2;

        context.fillStyle = isGlitchFrame ? '#ffffff' : color;
        context.globalAlpha = isGlitchFrame ? 0.72 : 0.18 + Math.random() * 0.36;
        context.fillText(character, x, column.y);

        if (isGlitchFrame) {
          context.globalAlpha = 0.18;
          context.fillText(character, x + 4, column.y);
        }

        column.y += fontSize * column.speed;
        if (column.y > height + Math.random() * 220) {
          column.y = -Math.random() * height * 0.45;
          column.speed = className.includes('intro') ? 0.24 + Math.random() * 0.58 : 0.16 + Math.random() * 0.38;
          column.colorOffset = Math.floor(Math.random() * palette.length);
          column.glitch = Math.random();
        }
      });

      context.globalAlpha = 1;
      frame += 1;
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    frame = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [className]);

  return <canvas ref={canvasRef} className={`matrix-rain ${className}`} style={{ opacity }} aria-hidden="true" />;
}

function PortfolioCanvas({
  onHoverStart,
  onHoverEnd,
  onProjectClick,
  onNavigate,
  projectColorIndexes,
  revealProgress,
  scrollProgress,
  projects,
}) {
  const randomLayout = useMemo(() => createRandomLayout(projects), [projects]);
  const itemRefs = useRef([]);

  useEffect(() => {
    const maxTravel = [
      { x: 34, y: 22 },
      { x: 30, y: 24 },
      { x: 38, y: 26 },
      { x: 32, y: 22 },
    ];
    const movers = projects.map((_, index) => ({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 16,
      vx: (index % 2 === 0 ? 1 : -1) * (7 + Math.random() * 5),
      vy: (index % 2 === 0 ? -1 : 1) * (6 + Math.random() * 4),
      maxX: maxTravel[index].x,
      maxY: maxTravel[index].y,
    }));
    let frame = 0;
    let previousTime = 0;

    const animate = (time) => {
      if (!previousTime) previousTime = time;
      const delta = Math.min((time - previousTime) / 1000, 0.04);
      previousTime = time;

      movers.forEach((mover, index) => {
        mover.x += mover.vx * delta;
        mover.y += mover.vy * delta;

        if (Math.abs(mover.x) >= mover.maxX) {
          mover.x = Math.sign(mover.x) * mover.maxX;
          mover.vx *= -0.96;
        }

        if (Math.abs(mover.y) >= mover.maxY) {
          mover.y = Math.sign(mover.y) * mover.maxY;
          mover.vy *= -0.96;
        }

        itemRefs.current[index]?.style.setProperty('--float-x', `${mover.x.toFixed(2)}px`);
        itemRefs.current[index]?.style.setProperty('--float-y', `${mover.y.toFixed(2)}px`);
      });

      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [projects]);

  return (
    <div className="portfolio-canvas">
      <div className="graphic-nav-container">
        {projects.map((project, index) => {
          const reveal = easeOutQuart(clamp((revealProgress - index * 0.12) / 0.58));
          const parallax = scrollProgress * (index % 2 === 0 ? -38 : 32);
          const colorIndex = projectColorIndexes[project.label];
          const selectedColor = colorIndex === undefined ? undefined : vibrantColors[colorIndex];
          const placement = randomLayout[index];

          return (
            <button
              className={`nav-item ${project.className} ${selectedColor ? 'is-colorized' : ''}`}
              key={project.label}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            onBlur={onHoverEnd}
            onClick={() => {
              onProjectClick(project.label);
              onNavigate(project.path);
            }}
              onFocus={() => onHoverStart(project)}
              onMouseEnter={() => onHoverStart(project)}
              onMouseLeave={onHoverEnd}
              onTouchStart={() => onHoverStart(project)}
              onTouchEnd={onHoverEnd}
              style={{
                '--item-color': selectedColor,
                '--item-stroke-color': selectedColor,
                ...placement,
                '--reveal-y': `${lerp(96, parallax, reveal)}px`,
                '--reveal-opacity': reveal,
              }}
              type="button"
            >
              {project.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MediaReveal({ activeProject, offset }) {
  const transform = useMemo(
    () => `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(1)`,
    [offset.x, offset.y],
  );
  const previewSrc = activeProject?.previewSrc || activeProject?.image || '';
  const previewType = activeProject?.previewType || (isVideoSource(previewSrc) ? 'video' : 'image');

  return (
    <div className="media-reveal" style={{ transform }}>
      {previewSrc && previewType === 'video' ? (
        <video key={previewSrc} src={previewSrc} poster={activeProject?.poster} muted autoPlay loop playsInline />
      ) : previewSrc && previewType === 'youtube' ? (
        <iframe key={previewSrc} src={getYouTubeEmbedUrl(previewSrc)} title="Project preview" allow="autoplay; encrypted-media; picture-in-picture" />
      ) : previewSrc ? (
        <img key={previewSrc} src={previewSrc} alt="" />
      ) : null}
    </div>
  );
}

function ProjectThumbnail({ project, index, onNavigate }) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const thumbnailSource = project.thumbnail || project.image || '';
  const thumbnailIsVideo = isVideoSource(thumbnailSource);
  const thumbnailIsYouTube = isYouTubeSource(thumbnailSource);
  const previewVideo = project.previewVideo || project.hero || project.videos?.[0] || '';
  const previewIsPlayable = isVideoSource(previewVideo) || isYouTubeSource(previewVideo);
  const hasPreviewVideo = previewIsPlayable;
  const showOverlayPreview = hasPreviewVideo && previewVideo !== thumbnailSource;
  const videoRef = useRef(null);

  const playPreview = () => {
    setIsPreviewing(true);
    if (thumbnailIsYouTube || isYouTubeSource(previewVideo)) return;
    if ((!hasPreviewVideo && !thumbnailIsVideo) || !videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
  };

  const pausePreview = () => {
    setIsPreviewing(false);
    if (!videoRef.current) return;
    videoRef.current.pause();
  };

  return (
    <button
      className={`project-thumb ${hasPreviewVideo ? 'has-video-preview' : ''}`}
      type="button"
      onClick={() => onNavigate(project.path)}
      onMouseEnter={playPreview}
      onMouseLeave={pausePreview}
      onFocus={playPreview}
      onBlur={pausePreview}
      onTouchStart={playPreview}
      onTouchEnd={pausePreview}
    >
      <div className="project-thumb__image">
        {thumbnailIsYouTube ? (
          <>
            {project.image && <img src={project.image} alt="" />}
            {isPreviewing && <YouTubeFrame src={thumbnailSource} title={`${project.title} thumbnail`} />}
          </>
        ) : thumbnailIsVideo ? (
          <video className="project-thumb__base-video" ref={videoRef} src={thumbnailSource} muted loop playsInline preload="metadata" />
        ) : (
          <img src={thumbnailSource} alt="" />
        )}
        {showOverlayPreview && isYouTubeSource(previewVideo) && isPreviewing ? (
          <YouTubeFrame src={previewVideo} title={`${project.title} preview`} />
        ) : showOverlayPreview ? (
          <video ref={videoRef} src={previewVideo} muted loop playsInline preload="metadata" />
        ) : null}
        <span>{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="project-thumb__meta">
        <span>{project.title}</span>
        <span>{project.year || project.role || project.categoryLabel || 'PROJECT'}</span>
      </div>
    </button>
  );
}

function ProjectGrid({ projects, onNavigate }) {
  const sortedProjects = useMemo(() => [...projects].sort(compareProjectsByYearAndTitle), [projects]);

  return (
    <div className="project-grid">
      {sortedProjects.map((project, index) => (
        <ProjectThumbnail project={project} index={index} key={project.path} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

function getProjectsForPage(page, projects) {
  if (page.category === 'featured') {
    const featured = projects.filter((project) => project.featured);
    return featured.length ? featured : projects.slice(0, 8);
  }
  if (page.category === 'about') return projects.slice(0, 4);
  return projects.filter((project) => projectHasCategory(project, page.category));
}

function PageContent({ page, projects, onNavigate }) {
  if (page.type === 'about') {
    return (
      <section className="page-content page-about">
        <div className="page-kicker">PROFILE / CONTACT</div>
        <h1>{page.title}</h1>
        <p>
          HI, MY NAME IS DAVONSY, AND I AM A VISUAL ARTIST.
          <br />
          <br />
          DESIGNING ENTIRE WORLDS THROUGH THE POWER OF 3DCG, MATERIALIZING BRAND PHILOSOPHY INTO IMMERSIVE VISUAL EXPERIENCES.
          <br />
          <br />
          BRIDGING FILM, VISUALS, AND DIGITAL EXPERIENCES TO CREATE MEMORABLE EXPRESSIONS.
          <br />
          <br />
          CRAFTING THE FUTURE OF BRANDS THROUGH REALISM THAT FEELS ALMOST TOUCHABLE.
        </p>
      </section>
    );
  }

  return (
    <section className={`page-content page-${page.type}`}>
      <div className="page-kicker">SELECTED / PROJECTS</div>
      <h1>{page.title}</h1>
      <ProjectGrid projects={getProjectsForPage(page, projects)} onNavigate={onNavigate} />
    </section>
  );
}

function SlideVideo({ src, active, poster }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (active) {
      videoRef.current.play().catch(() => {});
      return;
    }
    videoRef.current.pause();
  }, [active]);

  if (isYouTubeSource(src)) {
    return <YouTubeFrame src={src} active={active} />;
  }

  return <video ref={videoRef} src={src} muted loop playsInline controls={active} poster={poster} />;
}

function ProjectDetailPage({ project, onNavigate }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const primaryCategory = project.category || project.categories?.[0] || 'graphic';
  const categoryPath =
    primaryCategory === 'three'
      ? '/3d-vfx'
      : primaryCategory === 'film'
        ? '/film-photography'
        : primaryCategory === 'motion'
          ? '/motion-graphic'
          : '/graphic-design';
  const hasHeroVideo = project.hero && (isVideoSource(project.hero) || isYouTubeSource(project.hero));
  const detailImages = project.images?.length ? project.images : project.thumbnail || project.image ? [project.thumbnail || project.image] : [];
  const slides = [
    ...(project.hero
      ? [
          {
            type: hasHeroVideo ? 'video' : 'image',
            src: project.hero,
          },
        ]
      : []),
    ...(project.videos || []).map((src) => ({ type: isVideoSource(src) || isYouTubeSource(src) ? 'video' : 'image', src })),
    ...detailImages.map((src) => ({ type: 'image', src })),
  ].filter((slide, index, array) => slide.src && array.findIndex((item) => item.src === slide.src) === index);
  const safeSlides = slides.length ? slides : [{ type: 'image', src: project.thumbnail || project.image }];

  useEffect(() => {
    setActiveSlide(0);
  }, [project.slug]);

  const showPrevious = () => {
    setActiveSlide((current) => (current - 1 + safeSlides.length) % safeSlides.length);
  };

  const showNext = () => {
    setActiveSlide((current) => (current + 1) % safeSlides.length);
  };

  return (
    <section className="page-content project-detail">
      <button className="detail-back nav-pill" type="button" onClick={() => onNavigate(categoryPath)}>
        BACK / INDEX
      </button>
      <div className="page-kicker">PROJECT / DETAIL</div>
      <div className="detail-slideshow">
        <div className="detail-slides" aria-live="polite">
          {safeSlides.map((slide, index) => (
            <div className={`detail-slide ${index === activeSlide ? 'is-active' : ''}`} key={slide.src}>
              {slide.type === 'video' ? (
                <SlideVideo src={slide.src} active={index === activeSlide} poster={project.thumbnail || project.image} />
              ) : (
                <img src={slide.src} alt="" />
              )}
            </div>
          ))}
        </div>
        {safeSlides.length > 1 && (
          <div className="slideshow-controls">
            <button className="nav-pill" type="button" onClick={showPrevious}>
              PREV
            </button>
            <span>
              {String(activeSlide + 1).padStart(2, '0')} / {String(safeSlides.length).padStart(2, '0')}
            </span>
            <button className="nav-pill" type="button" onClick={showNext}>
              NEXT
            </button>
          </div>
        )}
      </div>
      <div className="detail-meta">
        <span>NAME / {project.title}</span>
        <span>YEAR / {project.year || 'TBA'}</span>
        <span>CATEGORY / {(project.categoryLabel || primaryCategory).toUpperCase()}</span>
        <span>ROLE / {project.role || 'TBA'}</span>
      </div>
      {project.description && <p className="detail-description">{project.description}</p>}
    </section>
  );
}

function CursorParticles() {
  const [particles, setParticles] = useState([]);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const now = performance.now();
      if (now - lastSpawnRef.current < 70) return;
      lastSpawnRef.current = now;

      const clusterSize = 2 + Math.floor(Math.random() * 3);
      const cluster = Array.from({ length: clusterSize }, (_, index) => ({
        id: `${now}-${index}-${Math.random()}`,
        symbol: cursorSymbols[Math.floor(Math.random() * cursorSymbols.length)],
        color: vibrantColors[Math.floor(Math.random() * vibrantColors.length)],
        x: event.clientX + (Math.random() - 0.5) * 34,
        y: event.clientY + (Math.random() - 0.5) * 34,
        driftX: (Math.random() - 0.5) * 42,
        driftY: (Math.random() - 0.5) * 42,
        rotate: (Math.random() - 0.5) * 92,
        size: 10 + Math.random() * 8,
      }));

      setParticles((currentParticles) => [...currentParticles.slice(-28), ...cluster]);
      window.setTimeout(() => {
        const clusterIds = new Set(cluster.map((particle) => particle.id));
        setParticles((currentParticles) => currentParticles.filter((item) => !clusterIds.has(item.id)));
      }, 1050);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div className="cursor-particles" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          style={{
            '--particle-color': particle.color,
            '--particle-x': `${particle.x}px`,
            '--particle-y': `${particle.y}px`,
            '--particle-drift-x': `${particle.driftX}px`,
            '--particle-drift-y': `${particle.driftY}px`,
            '--particle-rotate': `${particle.rotate}deg`,
            '--particle-size': `${particle.size}px`,
          }}
        >
          {particle.symbol}
        </span>
      ))}
    </div>
  );
}

export default function App({
  brandText = 'YUSUKE / KOGURE',
  portfolioText = 'PORTFOLIO',
  menuText = 'MENU',
  loadingText = 'LOADING',
  worldwideText = 'WORLDWIDE',
  instagramLabel = 'INSTAGRAM',
  instagramUrl = 'https://www.instagram.com/muso_creatives/?hl=en',
  linkedinLabel = 'LINKEDIN',
  linkedinUrl = 'https://www.linkedin.com/in/yusuke-kogure-8a4381239/',
  emailLabel = 'EMAIL',
  emailUrl = 'mailto:yusukekogure@agencymuso.com',
  sectionOne = 'GRAPHIC DESIGN',
  sectionTwo = 'MOTION GRAPHIC',
  sectionThree = '3D & VFX',
  sectionFour = 'FILM & PHOTOGRAPHY',
  backgroundColor = '#000000',
  panelColor = '#161616',
  accentGreen = '#90e06d',
  accentYellow = '#f7d147',
}) {
  const [activeProject, setActiveProject] = useState(null);
  const [hovering, setHovering] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [introLocked, setIntroLocked] = useState(true);
  const [introResetting, setIntroResetting] = useState(false);
  const [sequenceStarted, setSequenceStarted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [autoRevealProgress, setAutoRevealProgress] = useState(0);
  const [projectColorIndexes, setProjectColorIndexes] = useState({});
  const [route, setRoute] = useState(() => window.location.pathname);
  const [isPageSwitching, setIsPageSwitching] = useState(false);
  const [introRun, setIntroRun] = useState(0);
  const introRunRef = useRef(0);
  const lastPreviewByCategoryRef = useRef({});
  const progress = useScrollProgress(introLocked);
  const frameProgress = easeInOutCubic(clamp(progress / 0.58));
  const configurableProjects = useMemo(
    () =>
      defaultProjects.map((project, index) => ({
        ...project,
        label: [sectionOne, sectionTwo, sectionThree, sectionFour][index] || project.label,
      })),
    [sectionOne, sectionTwo, sectionThree, sectionFour],
  );
  const allProjects = useMemo(() => (hasFolderProjects ? folderProjects : legacyProjectCatalog), []);
  const socialLinks = useMemo(
    () => [
      { label: instagramLabel, href: instagramUrl },
      { label: linkedinLabel, href: linkedinUrl },
      { label: emailLabel, href: emailUrl },
    ],
    [instagramLabel, instagramUrl, linkedinLabel, linkedinUrl, emailLabel, emailUrl],
  );
  const currentProject = allProjects.find((project) => project.path === route);
  const currentPage = currentProject ? null : pageMeta[route] || pageMeta['/'];

  useEffect(() => {
    const handlePopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    setHovering(false);
    setActiveProject(null);
    setOffset({ x: 0, y: 0 });

    if (!path || path === route) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsPageSwitching(true);
    window.setTimeout(() => {
      window.history.pushState({}, '', path);
      setRoute(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.setTimeout(() => setIsPageSwitching(false), 140);
    }, 180);
  };

  const replayIntro = () => {
    const isAlreadyHome = window.location.pathname === '/';
    document.body.classList.add('intro-scroll-locked', 'force-intro-reset');
    window.scrollTo(0, 0);
    window.setTimeout(() => {
      if (isAlreadyHome) {
        window.location.reload();
        return;
      }
      window.location.replace('/');
    }, 120);
  };

  useEffect(() => {
    const runId = introRun;
    let revealFrame = 0;
    let revealStart = 0;
    let loadingFrame = 0;
    let loadingStart = 0;
    const rainIntroDuration = 1900;
    const revealDuration = 2200;

    window.scrollTo(0, 0);
    document.body.classList.add('intro-scroll-locked');

    const animateReveal = (time) => {
      if (introRunRef.current !== runId) return;
      if (!revealStart) revealStart = time;
      const progressValue = clamp((time - revealStart) / revealDuration);
      setAutoRevealProgress(easeInOutCubic(progressValue));

      if (progressValue < 1) {
        revealFrame = window.requestAnimationFrame(animateReveal);
      }
    };

    const unlockIntro = () => {
      if (introRunRef.current !== runId) return;
      setLoadingProgress(1);
      setIntroResetting(false);
      setSequenceStarted(true);
      document.body.classList.remove('intro-scroll-locked');
      setIntroLocked(false);
      revealFrame = window.requestAnimationFrame(animateReveal);
    };

    const animateLoading = (time) => {
      if (introRunRef.current !== runId) return;
      if (!loadingStart) loadingStart = time;

      const progressValue = clamp((time - loadingStart) / rainIntroDuration);
      setLoadingProgress(easeInOutCubic(progressValue));

      if (progressValue < 1) {
        loadingFrame = window.requestAnimationFrame(animateLoading);
        return;
      }

      unlockIntro();
    };

    loadingFrame = window.requestAnimationFrame(animateLoading);

    return () => {
      if (loadingFrame) window.cancelAnimationFrame(loadingFrame);
      if (revealFrame) window.cancelAnimationFrame(revealFrame);
      document.body.classList.remove('intro-scroll-locked');
    };
  }, [introRun]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!hovering) return;

      setOffset({
        x: (event.clientX / window.innerWidth - 0.5) * 20,
        y: (event.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    document.addEventListener('mousemove', handlePointerMove);
    return () => document.removeEventListener('mousemove', handlePointerMove);
  }, [hovering]);

  const handleHoverStart = (project) => {
    const categoryProjects = allProjects
      .filter((catalogProject) => projectHasCategory(catalogProject, project.category))
      .map((catalogProject) => ({
        ...catalogProject,
        ...getProjectPreview(catalogProject),
      }))
      .filter((catalogProject) => catalogProject.src);
    const lastPreview = lastPreviewByCategoryRef.current[project.category];
    const availableProjects =
      categoryProjects.length > 1
        ? categoryProjects.filter((catalogProject) => catalogProject.src !== lastPreview)
        : categoryProjects;
    const selectedPreview = availableProjects[Math.floor(Math.random() * availableProjects.length)];
    const fallbackPreview = getProjectPreview(project);
    const nextPreview = selectedPreview || {
      ...project,
      ...fallbackPreview,
    };

    lastPreviewByCategoryRef.current[project.category] = nextPreview.src;
    setActiveProject({
      ...project,
      image: nextPreview.src || project.image,
      poster: nextPreview.poster || nextPreview.thumbnail || project.image,
      previewSrc: nextPreview.src || project.image,
      previewType: nextPreview.type || 'image',
      title: nextPreview.title || project.label,
    });
    setHovering(true);
  };

  const handleHoverEnd = () => {
    setHovering(false);
    setOffset({ x: 0, y: 0 });
  };

  const handleProjectClick = (label) => {
    setProjectColorIndexes((currentIndexes) => ({
      ...currentIndexes,
      [label]: ((currentIndexes[label] ?? -1) + 1) % vibrantColors.length,
    }));
  };

  return (
    <main
      className={`landing-page ${hovering ? 'is-hovering' : ''} ${
        sequenceStarted && !introResetting ? 'sequence-started intro-complete' : 'intro-locked'
      }`}
      style={{
        '--bg-color': backgroundColor,
        '--panel-bg': panelColor,
        '--accent-green': accentGreen,
        '--accent-yellow': accentYellow,
      }}
    >
      <section className="scroll-stage">
        <div className="bg-canvas" />
        <CinematicVideoDisplay frameProgress={frameProgress} />
        <MatrixRain progress={Math.max(autoRevealProgress, progress)} />
        <LoadingTerminal progress={loadingProgress} label={loadingText} />
        <UtilityNav
          brandText={brandText}
          portfolioText={portfolioText}
          menuText={menuText}
          projects={configurableProjects}
          socialLinks={socialLinks}
          worldwideText={worldwideText}
          onNavigate={navigate}
          onReplayIntro={replayIntro}
        />
        <div className={`route-layer ${isPageSwitching ? 'is-switching' : ''}`}>
          {currentProject ? (
            <ProjectDetailPage project={currentProject} onNavigate={navigate} />
          ) : currentPage.type === 'home' ? (
            <PortfolioCanvas
              projects={configurableProjects}
              revealProgress={Math.max(autoRevealProgress, progress)}
              scrollProgress={progress}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
              onProjectClick={handleProjectClick}
              onNavigate={navigate}
              projectColorIndexes={projectColorIndexes}
            />
          ) : (
            <PageContent page={currentPage} projects={allProjects} onNavigate={navigate} />
          )}
        </div>
      </section>
      <MediaReveal activeProject={activeProject} offset={offset} />
      <CursorParticles />
    </main>
  );
}
