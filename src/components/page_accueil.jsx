import React, { useState, useEffect } from 'react';
import { AIBot } from './faqs';

const HostolinkHomepage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [headerExpanded, setHeaderExpanded] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  // Médias pour le carrousel (images et vidéos simulées)
  const mediaItems = [
    { type: 'image', src: 'https://images.pexels.com/photos/14438790/pexels-photo-14438790.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Interface principale' },
    { type: 'image', src: 'https://images.pexels.com/photos/8460035/pexels-photo-8460035.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Paiements' },
    { type: 'image', src: 'https://images.pexels.com/photos/7659872/pexels-photo-7659872.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Géolocalisation' },
    { type: 'video', src: 'https://videos.pexels.com/video-files/7423718/7423718-sd_360_640_30fps.mp4', alt: 'Démonstration' },
    { type: 'image', src: 'https://images.pexels.com/photos/14438790/pexels-photo-14438790.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Communauté' },
    { type: 'video', src: 'https://videos.pexels.com/video-files/6130113/6130113-sd_640_360_30fps.mp4', alt: 'Tutoriel' }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Auto-expansion de l'en-tête après 10 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isHeaderHovered) {
        setHeaderExpanded(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isHeaderHovered]);

  // Auto-fermeture de l'en-tête après 5 secondes si pas de hover
  useEffect(() => {
    if (headerExpanded && !isHeaderHovered) {
      const timer = setTimeout(() => {
        setHeaderExpanded(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [headerExpanded, isHeaderHovered]);

  // Changement automatique des médias toutes les 10 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMediaIndex(prev => (prev + 1) % mediaItems.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Observer pour animations au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const phoneStyle = {
    transform: `
      perspective(1000px) 
      rotateY(${mousePosition.x * 10}deg) 
      rotateX(${mousePosition.y * 5}deg) 
      translateY(${scrollY * 0.3}px)
      scale(${1 + Math.abs(mousePosition.x) * 0.1})
    `,
    transition: 'transform 0.1s ease'
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      color: '#ffffff',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #ec4899 100%)',
      minHeight: '100vh',
      position: 'relative'
    }}>

      {/* En-tête toujours visible avec expansion */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(30, 58, 138, 0.95)',
        backdropFilter: 'blur(20px)',
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.5s ease'
      }}
      onMouseEnter={() => {
        setIsHeaderHovered(true);
        setHeaderExpanded(true);
      }}
      onMouseLeave={() => {
        setIsHeaderHovered(false);
      }}>
        
        {/* Barre de navigation toujours visible */}
        <div style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          borderBottom: headerExpanded ? '1px solid rgba(255,255,255,0.1)' : 'none'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer'
          }}>
            🏥 HOSTOLINK
          </div>

          <nav style={{
            display: 'flex',
            gap: window.innerWidth > 768 ? '2rem' : '1rem',
            alignItems: 'center'
          }}>
            {['Accueil', 'Fonctionnalités', 'Télécharger', 'À propos', 'Contact', 'FAQ','Legal & Confidentialité'].map((item, index) => (
              <button
                key={item}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: window.innerWidth > 768 ? '1rem' : '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
                onClick={() => {
                  if (item === 'Télécharger') window.location.href = '/download';
                  else if (item === 'Contact') window.location.href = '/contact';
                  else if (item === 'À propos') window.location.href = '/about';
                  else if (item === 'Fonctionnalités') window.location.href = '/features';
                  else if (item === 'FAQ') window.location.href = '/question';
                  else if (item === 'Legal & Confidentialité') window.location.href = '/page_mention_legale_et_support';
                }}
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setHeaderExpanded(!headerExpanded)}
            style={{
              background: 'none',
              border: '2px solid rgba(255,255,255,0.3)',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {headerExpanded ? '▲' : '▼'}
          </button>
        </div>

        {/* Contenu étendu de l'en-tête */}
        <div style={{
          maxHeight: headerExpanded ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease',
          background: 'rgba(0,0,0,0.1)'
        }}>
          <div style={{
            padding: headerExpanded ? '2rem' : '0 2rem',
            transition: 'padding 0.5s ease'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth > 1024 ? '1fr 1fr 1fr' : window.innerWidth > 768 ? '1fr 1fr' : '1fr',
              gap: '3rem',
              maxWidth: '1200px',
              margin: '0 auto',
              opacity: headerExpanded ? 1 : 0,
              transition: 'opacity 0.5s ease'
            }}>
              
              {/* Section Aperçu App */}
              <div style={{ textAlign: 'center' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  📱 Aperçu de l'Application
                </h3>
                
                {/* Carrousel de médias */}
                <div style={{
                  position: 'relative',
                  width: '200px',
                  height: '350px',
                  margin: '0 auto',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${mediaItems[currentMediaIndex].src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'all 0.5s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    {mediaItems[currentMediaIndex].type === 'video' && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '3rem',
                        opacity: 0.8
                      }}>
                        ▶️
                      </div>
                    )}
                  </div>

                  {/* Indicateurs */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '5px'
                  }}>
                    {mediaItems.map((_, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: currentMediaIndex === index ? '#fbbf24' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <p style={{
                  marginTop: '1rem',
                  fontSize: '0.9rem',
                  opacity: 0.8
                }}>
                  {mediaItems[currentMediaIndex].alt}
                </p>
              </div>

              {/* Section Liens rapides */}
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  🚀 Liens Rapides
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { icon: '📱', title: 'Télécharger l\'app', desc: 'Android & iOS gratuit', link: '/download' },
                    { icon: '⚙️', title: 'Fonctionnalités', desc: 'Découvrez toutes les possibilités', link: '/features' },
                    { icon: '💬', title: 'Support 24/7', desc: 'Assistance en temps réel', link: '/contact' },
                    { icon: '❓', title: 'Centre d\'aide', desc: 'FAQ et guides', link: '/question' }
                  ].map((item, index) => (
                    <div
                      key={index}
                      onClick={() => window.location.href = item.link}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.2)';
                        e.target.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255,255,255,0.1)';
                        e.target.style.transform = 'translateX(0)';
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{item.title}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Stats */}
              {window.innerWidth > 768 && (
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(45deg, #ec4899, #be185d)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    📊 Statistiques
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { num: '12,547', label: 'Utilisateurs Actifs', trend: '+12%' },
                      { num: '850', label: 'Établissements', trend: '+8%' },
                      { num: '99.8%', label: 'Uptime', trend: 'Stable' },
                      { num: '24/7', label: 'Support', trend: 'Live' }
                    ].map((stat, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          padding: '1rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      >
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: '#fbbf24',
                          marginBottom: '0.3rem'
                        }}>
                          {stat.num}
                        </div>
                        <div style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                          {stat.label}
                        </div>
                        <div style={{
                          fontSize: '0.7rem',
                          color: '#10b981',
                          fontWeight: 'bold'
                        }}>
                          {stat.trend}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AIBot showInCorner={true} />

      {/* Particules flottantes */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              borderRadius: '50%',
              backgroundColor: ['#60a5fa', '#a78bfa', '#f472b6', '#34d399'][i % 4],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.6,
              transform: `translate(${mousePosition.x * (20 + i * 2)}px, ${mousePosition.y * (15 + i)}px)`,
              transition: 'transform 0.3s ease',
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'relative',
        zIndex: 10,
        padding: '0 2rem',
        paddingTop: '70px'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          
          {/* Contenu texte */}
          <div style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            opacity: 1 - scrollY * 0.001
          }}>
            <div style={{
              fontSize: '1.2rem',
              color: '#a5f3fc',
              marginBottom: '1rem',
              fontWeight: 'bold',
              transform: `translateX(${mousePosition.x * 10}px)`
            }}>
              🏥 Révolution Santé Numérique
            </div>

            <h1 style={{
              fontSize: window.innerWidth > 768 ? '4rem' : '2.5rem',
              fontWeight: 'bold',
              lineHeight: 1.1,
              marginBottom: '2rem',
              background: `linear-gradient(45deg, 
                hsl(${200 + mousePosition.x * 30}, 100%, 80%), 
                hsl(${280 + mousePosition.y * 30}, 100%, 90%))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(255,255,255,0.3)',
              transform: `scale(${1 + Math.abs(mousePosition.y) * 0.05})`
            }}>
              HOSTOLINK
              <br />
              <span style={{ fontSize: '0.7em', opacity: 0.9 }}>
                Paiements Santé Simplifiés
              </span>
            </h1>

            <p style={{
              fontSize: '1.3rem',
              lineHeight: 1.6,
              marginBottom: '3rem',
              opacity: 0.9,
              maxWidth: '500px',
              transform: `translateY(${mousePosition.y * 5}px)`
            }}>
              L'application mobile qui révolutionne vos paiements de santé. 
              Payez vos soins, trouvez des établissements et échangez avec la communauté santé.
            </p>

            {/* CTA Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1.5rem',
              flexWrap: 'wrap',
              marginBottom: '3rem'
            }}>
              {/* <button
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  cursor: 'pointer',
                  transform: `scale(${1 + Math.abs(mousePosition.x) * 0.05})`,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = `scale(${1 + Math.abs(mousePosition.x) * 0.05})`;
                  e.target.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.4)';
                }}
                onClick={() => window.location.href = '/download'}
              >
                📱 Télécharger l'app
              </button> */}

  <button
    style={{
      padding: '1rem 2rem',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '50px',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      cursor: 'pointer',
      transform: `scale(${1 + Math.abs(mousePosition.x) * 0.05})`,
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'scale(1.1)';
      e.target.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.6)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = `scale(${1 + Math.abs(mousePosition.x) * 0.05})`;
      e.target.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.4)';
    }}
    onClick={() => {
      document.getElementById('hidden-apk-link').click();
    }}
  >
    📱 Télécharger l'app
  </button>

  <a
    id="hidden-apk-link"
    href="/apk/hostolink.apk"
    download
    style={{ display: 'none' }}
  />


              <button
                style={{
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  border: '2px solid white',
                  borderRadius: '50px',
                  background: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  transform: `scale(${1 + Math.abs(mousePosition.y) * 0.05})`,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#1e3a8a';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'white';
                  e.target.style.transform = `scale(${1 + Math.abs(mousePosition.y) * 0.05})`;
                }}
              >
                🎬 Voir la démo
              </button>
            </div>

            {/* Stats rapides */}
            <div style={{ 
              display: 'flex', 
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              {[
                { num: '10K+', label: 'Utilisateurs' },
                { num: '500+', label: 'Établissements' },
                { num: '99.9%', label: 'Sécurisé' }
              ].map((stat, index) => (
                <div key={index} style={{
                  textAlign: 'center',
                  transform: `translateY(${Math.sin((Date.now() / 1000 + index) * 0.5) * 5}px)`
                }}>
                  <div style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {stat.num}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup Phone */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>
            <div style={phoneStyle}>
              <div style={{
                width: '300px',
                height: '600px',
                background: 'linear-gradient(135deg, #1f2937, #374151)',
                borderRadius: '30px',
                padding: '20px',
                border: '8px solid #4b5563',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Écran du téléphone */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  position: 'relative'
                }}>
                  {/* Contenu de l'écran simulé */}
                  <div style={{
                    textAlign: 'center',
                    transform: `translateY(${Math.sin(Date.now() / 1000) * 10}px)`
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💳</div>
                    <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>HOSTOLINK</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Paiement Santé</div>
                  </div>

                  {/* Éléments animés sur l'écran */}
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: '6px',
                        height: '6px',
                        background: 'rgba(255,255,255,0.6)',
                        borderRadius: '50%',
                        left: `${20 + i * 15}%`,
                        top: `${20 + i * 10}%`,
                        transform: `translateY(${Math.sin((Date.now() / 1000 + i) * 2) * 15}px)`,
                        opacity: 0.7
                      }}
                    />
                  ))}
                </div>

                {/* Bouton home */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '4px',
                  background: '#9ca3af',
                  borderRadius: '2px'
                }} />
              </div>
            </div>

            {/* Icônes flottantes autour du téléphone */}
            {[
              { icon: '💊', pos: { top: '10%', left: '10%' } },
              { icon: '🏥', pos: { top: '20%', right: '10%' } },
              { icon: '💳', pos: { bottom: '30%', left: '5%' } },
              { icon: '📱', pos: { bottom: '20%', right: '15%' } },
              { icon: '🔒', pos: { top: '50%', left: '5%' } }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  fontSize: '2rem',
                  ...item.pos,
                  transform: `translateY(${Math.sin((Date.now() / 1000 + index) * 0.8) * 20}px)`,
                  opacity: 0.8,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}
              >
                {item.icon}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: 0.7
        }}>
          <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Découvrir plus
          </div>
          <div style={{
            width: '2px',
            height: '30px',
            background: 'white',
            borderRadius: '1px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '10px',
              background: 'rgba(255,255,255,0.8)',
              borderRadius: '1px',
              transform: `translateY(${Math.sin(Date.now() / 500) * 20}px)`,
            }} />
          </div>
        </div>
      </section>

      {/* Section fonctionnalités rapides */}
      <section 
        id="features-preview"
        data-animate
        style={{ 
          padding: '4rem 2rem',
          position: 'relative',
          zIndex: 10,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '3rem',
            background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: isVisible['features-preview'] ? 'translateY(0)' : 'translateY(50px)',
            opacity: isVisible['features-preview'] ? 1 : 0,
            transition: 'all 1s ease'
          }}>
            Pourquoi choisir Hostolink ?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 768 ? 'repeat(3, 1fr)' : '1fr',
            gap: '2rem'
          }}>
            {[
              {
                icon: '💳',
                title: 'Paiements Sécurisés',
                desc: 'Payez vos soins via Wave avec une sécurité maximale'
              },
              {
                icon: '📍',
                title: 'Géolocalisation',
                desc: 'Trouvez pharmacies et centres de santé près de vous'
              },
              {
                icon: '👥',
                title: 'Communauté Santé',
                desc: 'Partagez et échangez avec d\'autres patients'
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '2rem',
                  borderRadius: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transform: isVisible['features-preview'] 
                    ? 'translateY(0) scale(1)' 
                    : 'translateY(50px) scale(0.9)',
                  opacity: isVisible['features-preview'] ? 1 : 0,
                  transition: `all 1s ease ${index * 0.2}s`,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-10px) scale(1.05)';
                  e.target.style.background = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                  {feature.title}
                </h3>
                <p style={{ opacity: 0.8, lineHeight: 1.5 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default HostolinkHomepage;
