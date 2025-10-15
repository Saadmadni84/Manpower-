import React, { useState, useRef, useEffect } from 'react';
import styles from './IndustryMap.module.css';

const IndustryMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const mapRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const regions = [
    {
      id: 'riyadh',
      name: 'Riyadh',
      path: 'M 200 100 L 250 90 L 280 120 L 270 150 L 240 160 L 210 140 Z',
      center: { x: 235, y: 125 },
      stats: {
        employees: '4,500',
        industries: ['Corporate Offices', 'Construction', 'Aviation'],
        clients: '150+',
        percentage: 45
      },
      color: '#3b82f6'
    },
    {
      id: 'jeddah',
      name: 'Jeddah',
      path: 'M 50 200 L 100 190 L 130 220 L 120 250 L 90 260 L 60 240 Z',
      center: { x: 85, y: 225 },
      stats: {
        employees: '3,200',
        industries: ['Airport Operations', 'Port Services', 'Catering'],
        clients: '120+',
        percentage: 32
      },
      color: '#06b6d4'
    },
    {
      id: 'dammam',
      name: 'Dammam',
      path: 'M 300 180 L 350 170 L 380 200 L 370 230 L 340 240 L 310 220 Z',
      center: { x: 335, y: 205 },
      stats: {
        employees: '1,800',
        industries: ['Oil & Gas', 'Industrial', 'Logistics'],
        clients: '80+',
        percentage: 18
      },
      color: '#10b981'
    },
    {
      id: 'madina',
      name: 'Madina',
      path: 'M 150 300 L 200 290 L 230 320 L 220 350 L 190 360 L 160 340 Z',
      center: { x: 185, y: 325 },
      stats: {
        employees: '500',
        industries: ['Hospitality', 'Tourism', 'Services'],
        clients: '25+',
        percentage: 5
      },
      color: '#f97316'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
  };

  const handleRegionHover = (region) => {
    setHoveredRegion(region);
  };

  const handleRegionLeave = () => {
    setHoveredRegion(null);
  };

  return (
    <div className={styles.mapContainer} ref={mapRef}>
      <div className={styles.mapHeader}>
        <h3 className={styles.mapTitle}>Our Workforce Distribution Across Saudi Arabia</h3>
        <p className={styles.mapSubtitle}>Click on any region to see detailed statistics</p>
      </div>

      <div className={styles.mapWrapper}>
        <svg
          viewBox="0 0 400 400"
          className={styles.mapSvg}
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'scale(1)' : 'scale(0.9)' }}
        >
          {/* Background */}
          <rect width="400" height="400" fill="#f8fafc" rx="20" />

          {/* Grid Lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="400" height="400" fill="url(#grid)" />

          {/* Regions */}
          {regions.map((region) => (
            <g key={region.id}>
              <path
                d={region.path}
                fill={region.color}
                fillOpacity={selectedRegion?.id === region.id ? 0.8 : hoveredRegion?.id === region.id ? 0.7 : 0.5}
                stroke="#ffffff"
                strokeWidth="2"
                className={styles.region}
                onClick={() => handleRegionClick(region)}
                onMouseEnter={() => handleRegionHover(region)}
                onMouseLeave={handleRegionLeave}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  filter: selectedRegion?.id === region.id ? 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' : 'none'
                }}
              />
              
              {/* Region Labels */}
              <text
                x={region.center.x}
                y={region.center.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.regionLabel}
                fill="#ffffff"
                fontSize="12"
                fontWeight="600"
                pointerEvents="none"
              >
                {region.name}
              </text>

              {/* Employee Count */}
              <text
                x={region.center.x}
                y={region.center.y + 15}
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.employeeCount}
                fill="#ffffff"
                fontSize="10"
                fontWeight="500"
                pointerEvents="none"
              >
                {region.stats.employees} employees
              </text>
            </g>
          ))}

          {/* Legend */}
          <g className={styles.legend}>
            <rect x="20" y="20" width="120" height="80" fill="rgba(255,255,255,0.9)" rx="8" />
            <text x="30" y="35" fontSize="12" fontWeight="600" fill="#1e293b">Legend</text>
            {regions.map((region, index) => (
              <g key={region.id}>
                <rect x="30" y={45 + index * 12} width="10" height="8" fill={region.color} rx="2" />
                <text x="45" y={50 + index * 12} fontSize="10" fill="#64748b">{region.name}</text>
              </g>
            ))}
          </g>
        </svg>

        {/* Region Details Panel */}
        {selectedRegion && (
          <div className={styles.detailsPanel}>
            <div className={styles.panelHeader}>
              <h4 className={styles.panelTitle}>{selectedRegion.name} Region</h4>
              <button 
                className={styles.closeButton}
                onClick={() => setSelectedRegion(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.panelContent}>
              <div className={styles.statGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statValue} style={{ color: selectedRegion.color }}>
                    {selectedRegion.stats.employees}
                  </div>
                  <div className={styles.statLabel}>Active Employees</div>
                </div>

                <div className={styles.statItem}>
                  <div className={styles.statValue} style={{ color: selectedRegion.color }}>
                    {selectedRegion.stats.clients}
                  </div>
                  <div className={styles.statLabel}>Active Clients</div>
                </div>

                <div className={styles.statItem}>
                  <div className={styles.statValue} style={{ color: selectedRegion.color }}>
                    {selectedRegion.stats.percentage}%
                  </div>
                  <div className={styles.statLabel}>Total Workforce</div>
                </div>
              </div>

              <div className={styles.industriesList}>
                <h5 className={styles.industriesTitle}>Key Industries</h5>
                <div className={styles.industries}>
                  {selectedRegion.stats.industries.map((industry, index) => (
                    <div key={index} className={styles.industryItem}>
                      <div className={styles.industryDot} style={{ backgroundColor: selectedRegion.color }}></div>
                      <span className={styles.industryName}>{industry}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.progressBar}>
                <div className={styles.progressLabel}>Market Coverage</div>
                <div className={styles.progressTrack}>
                  <div 
                    className={styles.progressFill}
                    style={{ 
                      width: `${selectedRegion.stats.percentage}%`,
                      backgroundColor: selectedRegion.color
                    }}
                  ></div>
                </div>
                <div className={styles.progressValue}>{selectedRegion.stats.percentage}%</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hover Tooltip */}
      {hoveredRegion && !selectedRegion && (
        <div 
          className={styles.tooltip}
          style={{
            left: hoveredRegion.center.x + 20,
            top: hoveredRegion.center.y - 10
          }}
        >
          <div className={styles.tooltipContent}>
            <div className={styles.tooltipTitle}>{hoveredRegion.name}</div>
            <div className={styles.tooltipStats}>
              {hoveredRegion.stats.employees} employees • {hoveredRegion.stats.clients} clients
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryMap;
