import React from 'react';

interface Props {
  onSelect: (q: string) => void;
}

const CARDS = [
  { icon: 'ti-gavel', title: 'Exekuce', desc: 'Co dělat, když vám přišlo usnesení o exekuci', q: 'Jsem v exekuci, co mám dělat?' },
  { icon: 'ti-users', title: 'Rozvod', desc: 'Průběh rozvodu, péče o děti, majetkové vypořádání', q: 'Jak probíhá rozvod v ČR?' },
  { icon: 'ti-briefcase', title: 'Výpověď z práce', desc: 'Výpovědní doba, odstupné, neplatná výpověď', q: 'Dostal jsem výpověď, jaká jsou má práva?' },
  { icon: 'ti-home', title: 'Kauce u nájmu', desc: 'Vrácení kauce, povinnosti pronajímatele', q: 'Pronajímatel mi nechce vrátit kauci, co mohu dělat?' },
];

export const WelcomeScreen: React.FC<Props> = ({ onSelect }) => (
  <div className="welcome-screen">
    <div className="welcome-logo">Č</div>
    <h2 className="welcome-title">Dobrý den, jsem ČENDA</h2>
    <p className="welcome-sub">
      Váš virtuální právní poradce pro životní situace v České republice.
      Ptejte se na dluhy, exekuce, rozvod, práci, bydlení a další.
    </p>
    <div className="welcome-cards">
      {CARDS.map((c) => (
        <button key={c.q} className="welcome-card" onClick={() => onSelect(c.q)}>
          <i className={`ti ${c.icon} welcome-card-icon`} aria-hidden="true" />
          <div className="welcome-card-title">{c.title}</div>
          <p>{c.desc}</p>
        </button>
      ))}
    </div>
  </div>
);
