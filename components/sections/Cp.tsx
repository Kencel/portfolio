'use client';
import { useState } from 'react';
import { HoverQuad } from '@/components/ui/HoverQuad';
import { chip, unskew } from '@/lib/chipStyle';
import { COLOR, FONT } from '@/lib/tokens';
import type { CpStats } from '@/lib/cp/types';
import type { Competition } from '@/lib/competitions';
import { PlatformPanel, type PlatformConfig } from '@/components/cp/PlatformPanel';
import { CompetitionsList } from '@/components/cp/CompetitionsList';

type Tab = 'cf' | 'atcoder' | 'competitions';
const TABS: { id: Tab; label: string }[] = [
  { id: 'cf', label: 'CODEFORCES' },
  { id: 'atcoder', label: 'ATCODER' },
  { id: 'competitions', label: 'COMPETITIONS' },
];

const CF_CONFIG: PlatformConfig = {
  title: 'CODEFORCES', accent: COLOR.accent,
  handleUrl: 'https://codeforces.com/profile/RamenNagi', perfApprox: true, seedBase: 41,
};
const ATCODER_CONFIG: PlatformConfig = {
  title: 'ATCODER', accent: COLOR.ink,
  handleUrl: 'https://atcoder.jp/users/RamenNagi', perfApprox: false, seedBase: 51,
};

const themedLine = {
  fontFamily: FONT.bebas, letterSpacing: '.2em', fontSize: 22,
  color: COLOR.ink, opacity: .75, textAlign: 'center' as const, padding: '40px 0',
};

export function Cp({ stats, competitions }: { stats: CpStats; competitions: Competition[] }) {
  const [tab, setTab] = useState<Tab>('cf');
  return (
    <div style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 26 }}>
        {TABS.map((t, i) => (
          <HoverQuad key={t.id} seed={20 + i}>
            <button aria-pressed={tab === t.id} onClick={() => setTab(t.id)} style={chip(tab === t.id)}>
              <span style={unskew}>{t.label}</span>
            </button>
          </HoverQuad>
        ))}
      </div>
      {tab === 'cf' && (stats.cf
        ? <PlatformPanel stats={stats.cf} config={CF_CONFIG} />
        : <p style={themedLine}>CODEFORCES DATA UNAVAILABLE — CHECK BACK SOON</p>)}
      {tab === 'atcoder' && (stats.atcoder
        ? <PlatformPanel stats={stats.atcoder} config={ATCODER_CONFIG} />
        : <p style={themedLine}>ATCODER DATA UNAVAILABLE — CHECK BACK SOON</p>)}
      {tab === 'competitions' && <CompetitionsList competitions={competitions} />}
    </div>
  );
}
