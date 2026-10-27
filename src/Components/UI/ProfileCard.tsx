'use client';
import { useRef } from 'react';
import { useAppContext } from '@/Context/AppContext';

const skills = ['React.js', 'Next.js', 'Node.js', 'Tailwind', 'TypeScript', 'Three.js'];

const ProfileCard = () => {
  const { darkMode } = useAppContext();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -20;
    if (cardRef.current) {
      cardRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = '';
    }
  };

  return (
    <div
      className="profile-card-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1200px', width: 340, height: 480, cursor: 'pointer' }}
    >
      {/* Outer wrapper adds the Y-flip on hover via CSS */}
      <div ref={cardRef} className="profile-card-inner">

        {/* ── FRONT ─────────────────────────────────────────── */}
        <div className={`profile-face profile-face-front ${darkMode ? 'dark' : 'light'}`}>
          {/* Glowing ring around initials avatar */}
          <div className="avatar-ring">
            <div className={`avatar-inner ${darkMode ? 'dark' : 'light'}`}>
              FK
            </div>
          </div>
          <p className={`card-name ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Furqan Khattak
          </p>
          <p className={`card-role ${darkMode ? 'text-purple-300' : 'text-indigo-500'}`}>
            Front-End Developer · Remote · Canada
          </p>
          <p className={`card-hint ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            ↻ Hover to flip
          </p>
        </div>

        {/* ── BACK ──────────────────────────────────────────── */}
        <div className="profile-face profile-face-back">
          <p className="back-greeting">Hello! 👋</p>
          <p className="back-bio">
            Passionate developer crafting scalable web experiences with modern technologies.
            Let&apos;s build something amazing together.
          </p>
          <div className="skill-tags">
            {skills.map(s => (
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-card-wrap {
          position: relative;
        }
        .profile-card-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
          border-radius: 28px;
        }
        .profile-card-wrap:hover .profile-card-inner {
          transform: rotateY(180deg) !important;
        }
        .profile-face {
          position: absolute;
          inset: 0;
          border-radius: 28px;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 32px;
        }
        .profile-face-front.dark {
          background: linear-gradient(145deg, #14142a, #10101e);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .profile-face-front.light {
          background: linear-gradient(145deg, #ffffff, #ede8ff);
          border: 1px solid rgba(100,80,200,0.15);
        }
        .profile-face-back {
          background: linear-gradient(135deg, #7c5cfc, #fc5c7d);
          transform: rotateY(180deg);
          color: #fff;
          text-align: center;
        }
        .avatar-ring {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c5cfc, #fc5c7d);
          padding: 3px;
          flex-shrink: 0;
        }
        .avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 3.5rem;
          font-weight: 800;
        }
        .avatar-inner.dark {
          background: #14142a;
          color: #7c5cfc;
        }
        .avatar-inner.light {
          background: #fff;
          color: #5b3ef5;
        }
        .card-name {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          margin: 0;
        }
        .card-role {
          font-size: 0.8rem;
          letter-spacing: 0.03em;
          margin: 0;
          text-align: center;
        }
        .card-hint {
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin: 0;
        }
        .back-greeting {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          margin: 0;
        }
        .back-bio {
          font-size: 0.85rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.85);
          margin: 0;
        }
        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-top: 8px;
        }
        .skill-tag {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          letter-spacing: 0.03em;
        }
      `}</style>
    </div>
  );
};

export default ProfileCard;