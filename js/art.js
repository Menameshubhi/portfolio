/* Illustrations for Shubhangi's World — buildings, character and props.
   Every function returns an SVG markup string drawn around a local origin at
   the object's base (ground line / feet), so it can be placed with a single
   translate(). Colors are fixed so the art looks the same everywhere. */
(function () {
  'use strict';

  const C = {
    ink: '#23263A', ink2: '#2F3350', inkMid: '#3A3F60', inkLine: '#5A608A',
    cream: '#FFF6E6', cream2: '#F6E7CB', white: '#FFFDF8',
    sand: '#F3DDB0', sandEdge: '#E0BE86', stone: '#E6DCCB', stone2: '#D3C6B0',
    aquaLight: '#DDF3EF', aqua: '#BFE6E0', aquaMid: '#8FD3C8', aquaDeep: '#2F857C', bag: '#5FB7AE',
    glass: '#9ED9CF', glow: '#FFE3A3',
    leaf: '#7DB86A', leafLight: '#A6D38F', leafDeep: '#4E8F4A', leafDark: '#3B7339',
    grass: '#B8DC98', grassDark: '#9CC97C',
    coral: '#FF7A5C', coralDeep: '#E2563A', coralLight: '#FFB4A0', blossom: '#F6A9A0',
    sun: '#FFC857', wood: '#C98B56', woodLight: '#E9C08A', woodDark: '#9C6838',
    visit: '#714FFF', visitLight: '#B8A8FF', visitPale: '#EEE9FF', ikBlue: '#3996D2', ikNavy: '#344158', ikPale: '#E4F1FA', affPink: '#E32764', affPinkDeep: '#B81A4D', affGrey: '#4C4D4F', dress: '#FFFDF8', tote: '#F1E6CF',
    skin: '#C98E6B', skinShade: '#B27756', hair: '#2A2233', hairHi: '#4A3F5C'
  };

  const st = (w = 3) =>
    `stroke="${C.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

  const label = (x, y, size, str, o = {}) =>
    `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-weight="${o.weight || 700}" ` +
    `fill="${o.fill || C.ink}" letter-spacing="${o.ls || 0}" class="${o.body ? 'svg-body' : 'svg-display'}">${str}</text>`;

  const shadow = (rx, ry = 20, dx = 12) =>
    `<ellipse cx="${dx}" cy="3" rx="${rx}" ry="${ry}" fill="${C.ink}" opacity=".13"/>`;

  // Window with panes; .b-glass lights up when the building is open.
  function win(x, y, w, h, arch) {
    const shape = arch
      ? `<path class="b-glass" d="M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z" fill="${C.glass}" ${st(2.5)}/>`
      : `<rect class="b-glass" x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${C.glass}" ${st(2.5)}/>`;
    const cx = x + w / 2;
    const cy = arch ? y + (w / 2 + h) / 2 : y + h / 2;
    return `<g class="b-window">${shape}
      <path d="M${cx} ${y + 1} V${y + h} M${x} ${cy} H${x + w}" stroke="${C.ink}" stroke-width="2"/>
      <path d="M${x + 5} ${y + h - 6} L${x + w * 0.42} ${y + (arch ? w / 2 : 7)}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/></g>`;
  }

  // White sign plate with a brand logo (files in assets/brand/). crop = [x, y, w, h] of the source image.
  function logoPlate(cx, y, pw, ph, src, iw, ih, pad, crop) {
    const h = ph - pad * 2, w = h * (crop ? crop[2] / crop[3] : iw / ih);
    const img = crop
      ? `<svg x="${cx - w / 2}" y="${y + pad}" width="${w}" height="${h}" viewBox="${crop.join(' ')}"><image href="${src}" width="${iw}" height="${ih}"/></svg>`
      : `<image href="${src}" x="${cx - w / 2}" y="${y + pad}" width="${w}" height="${h}"/>`;
    return `<rect x="${cx - pw / 2}" y="${y}" width="${pw}" height="${ph}" rx="7" fill="${C.white}" ${st(2.5)}/>${img}`;
  }

  const flowerRow = (x0, y, n, step) => {
    const cols = [C.coral, C.sun, C.coralLight, C.white];
    let s = '';
    for (let i = 0; i < n; i++) s += `<circle cx="${x0 + i * step}" cy="${y}" r="4.2" fill="${cols[i % 4]}" ${st(1.5)}/>`;
    return s;
  };

  /* -------------------------------------------------------------- Buildings */

  function home() {
    return `${shadow(132)}
    <g class="b-smoke">
      <circle cx="58" cy="-234" r="7" fill="#fff" opacity=".85"/>
      <circle cx="66" cy="-250" r="9" fill="#fff" opacity=".65"/>
      <circle cx="58" cy="-268" r="11" fill="#fff" opacity=".45"/>
    </g>
    <rect x="46" y="-216" width="24" height="52" fill="${C.coralDeep}" ${st()}/>
    <rect x="41" y="-224" width="34" height="11" rx="3" fill="${C.ink2}" ${st()}/>
    <rect x="-92" y="-130" width="184" height="130" rx="4" fill="${C.cream}" ${st()}/>
    <rect x="-92" y="-20" width="184" height="20" fill="${C.cream2}" ${st()}/>
    <path d="M-116 -118 L-72 -196 L72 -196 L116 -118 Z" fill="${C.coral}" ${st()}/>
    <path d="M-98 -150 H98 M-84 -174 H84" stroke="${C.coralDeep}" stroke-width="3" stroke-linecap="round"/>
    <rect x="-120" y="-126" width="240" height="12" rx="5" fill="${C.coralDeep}" ${st()}/>
    <circle class="b-glass" cx="0" cy="-160" r="15" fill="${C.glass}" ${st(2.5)}/>
    <path d="M0 -175 V-145 M-15 -160 H15" stroke="${C.ink}" stroke-width="2"/>
    ${win(-76, -104, 40, 38)}${win(36, -104, 40, 38)}
    <rect x="-80" y="-64" width="48" height="10" rx="2" fill="${C.leafDeep}" ${st(2.5)}/>
    <rect x="32" y="-64" width="48" height="10" rx="2" fill="${C.leafDeep}" ${st(2.5)}/>
    ${flowerRow(-72, -68, 4, 10.5)}${flowerRow(40, -68, 4, 10.5)}
    <rect x="-30" y="-94" width="60" height="19" rx="5" fill="${C.white}" ${st(2.5)}/>
    ${label(0, -80, 11, 'HOME', { ls: 2, body: true, weight: 800 })}
    <path class="b-interior" d="M-20 0 V-46 A20 20 0 0 1 20 -46 V0 Z" fill="${C.glow}"/>
    <g class="b-door"><path d="M-20 0 V-46 A20 20 0 0 1 20 -46 V0 Z" fill="${C.bag}" ${st()}/>
      <path d="M-10 -10 V-40 M10 -10 V-40" stroke="${C.aquaDeep}" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="12" cy="-26" r="2.6" fill="${C.sun}" ${st(1.5)}/></g>
    <path d="M-20 0 V-46 A20 20 0 0 1 20 -46 V0" fill="none" ${st()}/>
    <rect x="-28" y="-3" width="56" height="8" rx="2" fill="${C.stone2}" ${st(2.5)}/>
    <rect x="109" y="-36" width="6" height="36" fill="${C.wood}" ${st(2)}/>
    <rect x="98" y="-54" width="30" height="20" rx="9" fill="${C.coral}" ${st(2.5)}/>
    <path d="M124 -52 V-66 H134 V-60 H124" fill="${C.sun}" ${st(2)}/>`;
  }

  function visitHealth() {
    return `${shadow(150)}
    <rect x="-126" y="-178" width="252" height="178" rx="4" fill="${C.visitPale}" ${st()}/>
    <path d="M-136 -180 L-118 -202 L118 -202 L136 -180 Z" fill="${C.visitLight}" ${st()}/>
    <circle cx="-92" cy="-204" r="10" fill="${C.leaf}" ${st(2.5)}/>
    <circle cx="-76" cy="-206" r="8" fill="${C.leafDeep}" ${st(2.5)}/>
    <rect x="66" y="-216" width="32" height="16" rx="3" fill="${C.white}" ${st(2.5)}/>
    <path d="M72 -208 H92" stroke="${C.ink}" stroke-width="2"/>
    <rect x="-138" y="-186" width="276" height="12" rx="4" fill="${C.visit}" ${st()}/>
    ${logoPlate(0, -172, 168, 40, 'assets/brand/visit.png', 1808, 593, 5)}
    ${win(-112, -124, 36, 34)}${win(-68, -124, 36, 34)}${win(32, -124, 36, 34)}${win(76, -124, 36, 34)}
    ${win(-112, -76, 54, 44)}${win(58, -76, 54, 44)}
    <path d="M-58 -88 L58 -88 L66 -74 L-66 -74 Z" fill="${C.visit}" ${st(2.5)}/>
    <path d="M-66 -74 q8.25 9 16.5 0 q8.25 9 16.5 0 q8.25 9 16.5 0 q8.25 9 16.5 0 q8.25 9 16.5 0 q8.25 9 16.5 0 q8.25 9 16.5 0 q8.25 9 16.5 0" fill="${C.visit}" ${st(2.5)}/>
    <rect class="b-interior" x="-40" y="-66" width="80" height="66" fill="${C.glow}"/>
    <g class="b-door b-door-l"><rect x="-40" y="-66" width="40" height="66" fill="${C.glass}" ${st(2.5)}/>
      <path d="M-33 -12 L-14 -54" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/></g>
    <g class="b-door b-door-r"><rect x="0" y="-66" width="40" height="66" fill="${C.glass}" ${st(2.5)}/>
      <path d="M7 -12 L26 -54" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/></g>
    <rect x="-44" y="-68" width="88" height="68" fill="none" ${st()}/>
    <rect x="-52" y="-3" width="104" height="8" rx="2" fill="${C.stone2}" ${st(2.5)}/>`;
  }

  function interviewKickstart() {
    return `${shadow(142)}
    <rect x="-124" y="-132" width="248" height="132" rx="4" fill="${C.ikPale}" ${st()}/>
    <path d="M-136 -130 L-114 -156 L114 -156 L136 -130 Z" fill="${C.ikBlue}" ${st()}/>
    <rect x="-138" y="-136" width="276" height="11" rx="4" fill="${C.ikNavy}" ${st()}/>
    ${win(-110, -88, 28, 44, true)}${win(-74, -88, 28, 44, true)}${win(46, -88, 28, 44, true)}${win(82, -88, 28, 44, true)}
    <rect x="-46" y="-222" width="92" height="222" fill="#F3F9FD" ${st()}/>
    <path d="M-56 -216 L0 -258 L56 -216 Z" fill="${C.ikBlue}" ${st()}/>
    <rect x="-58" y="-224" width="116" height="10" rx="4" fill="${C.ikBlue}" ${st()}/>
    <circle cx="0" cy="-190" r="18" fill="${C.white}" ${st()}/>
    <path d="M0 -190 V-201 M0 -190 L8 -186" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M0 -206 V-203 M16 -190 H13 M0 -174 V-177 M-16 -190 H-13" stroke="${C.ink}" stroke-width="2"/>
    ${win(-10, -164, 20, 30, true)}
    <g class="b-rocket" transform="translate(0 -258)"><g class="b-rocket-inner">
      <path class="b-flame" d="M-5 -4 Q0 14 5 -4 Z" fill="${C.sun}" ${st(2)}/>
      <path d="M-7 -14 L-15 -2 L-7 -5 Z M7 -14 L15 -2 L7 -5 Z" fill="${C.coral}" ${st(2)}/>
      <path d="M0 -46 C11 -34 11 -15 7 -4 L-7 -4 C-11 -15 -11 -34 0 -46 Z" fill="${C.white}" ${st(2.5)}/>
      <circle cx="0" cy="-27" r="4.5" fill="${C.glass}" ${st(2)}/>
    </g></g>
    ${logoPlate(0, -126, 214, 32, 'assets/brand/interview-kickstart.svg', 600, 128, 4)}
    <path class="b-interior" d="M-24 0 V-44 A24 24 0 0 1 24 -44 V0 Z" fill="${C.glow}"/>
    <g class="b-door"><path d="M-24 0 V-44 A24 24 0 0 1 24 -44 V0 Z" fill="${C.ikNavy}" ${st()}/>
      <path d="M0 -66 V0 M-14 -36 H-6 M6 -36 H14" stroke="${C.ikBlue}" stroke-width="2.5" stroke-linecap="round"/></g>
    <path d="M-24 0 V-44 A24 24 0 0 1 24 -44 V0" fill="none" ${st()}/>
    <rect x="-34" y="-3" width="68" height="8" rx="2" fill="${C.stone2}" ${st(2.5)}/>`;
  }

  function affixious() {
    const col = (x) => `<rect x="${x}" y="-140" width="16" height="114" fill="${C.white}" ${st(2.5)}/>
      <rect x="${x - 3}" y="-146" width="22" height="8" rx="2" fill="${C.cream2}" ${st(2.5)}/>
      <rect x="${x - 3}" y="-32" width="22" height="7" rx="2" fill="${C.cream2}" ${st(2.5)}/>`;
    return `${shadow(152)}
    <rect x="-134" y="-12" width="268" height="14" rx="2" fill="${C.stone}" ${st()}/>
    <rect x="-122" y="-25" width="244" height="13" rx="2" fill="${C.cream2}" ${st()}/>
    <rect x="-112" y="-152" width="224" height="127" fill="${C.cream}" ${st()}/>
    ${win(-84, -118, 22, 50)}${win(62, -118, 22, 50)}
    ${col(-104)}${col(-58)}${col(42)}${col(88)}
    <path d="M-136 -166 L0 -228 L136 -166 Z" fill="${C.affGrey}" ${st()}/>
    <path d="M-104 -172 L0 -217 L104 -172 Z" fill="none" stroke="${C.inkLine}" stroke-width="2"/>
    <circle class="b-glass" cx="0" cy="-190" r="10" fill="${C.affPink}" ${st(2.5)}/>
    <rect x="-128" y="-168" width="256" height="22" rx="3" fill="${C.affGrey}" ${st()}/>
    ${logoPlate(0, -182, 148, 40, 'assets/brand/affixious.jpeg', 360, 360, 4, [44, 138, 276, 84])}
    <path d="M-42 -96 L42 -96 L48 -84 L-48 -84 Z" fill="${C.affPink}" ${st(2.5)}/>
    <path d="M-48 -84 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0 q8 8 16 0" fill="${C.affPink}" ${st(2.5)}/>
    <rect class="b-interior" x="-30" y="-76" width="60" height="51" fill="${C.glow}"/>
    <g class="b-door b-door-l"><rect x="-30" y="-76" width="30" height="51" fill="${C.affPinkDeep}" ${st(2.5)}/>
      <rect x="-24" y="-68" width="18" height="16" rx="2" fill="none" stroke="#7C1236" stroke-width="2"/>
      <rect x="-24" y="-46" width="18" height="15" rx="2" fill="none" stroke="#7C1236" stroke-width="2"/></g>
    <g class="b-door b-door-r"><rect x="0" y="-76" width="30" height="51" fill="${C.affPinkDeep}" ${st(2.5)}/>
      <rect x="6" y="-68" width="18" height="16" rx="2" fill="none" stroke="#7C1236" stroke-width="2"/>
      <rect x="6" y="-46" width="18" height="15" rx="2" fill="none" stroke="#7C1236" stroke-width="2"/></g>
    <rect x="-30" y="-76" width="60" height="51" fill="none" ${st()}/>`;
  }

  function future() {
    let zig = '';
    for (let y = -40; y > -250; y -= 18) zig += `M-112 ${y} L-98 ${y - 9} L-112 ${y - 18} `;
    let jib = '';
    for (let x = -126; x < 150; x += 16) jib += `M${x} -258 L${x + 8} -268 L${x + 16} -258 `;
    return `${shadow(150, 20, 6)}
    <rect x="-128" y="-16" width="256" height="18" rx="3" fill="${C.stone}" ${st()}/>
    <path d="M-128 -16 L-112 -30 L112 -30 L128 -16 Z" fill="#F3EBDD" ${st()}/>
    <g opacity=".5"><rect x="-90" y="-176" width="180" height="146" fill="#fff" fill-opacity=".35" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="9 8"/>
      <path d="M-104 -172 L-76 -210 L76 -210 L104 -172 Z" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="9 8"/></g>
    <g class="b-rays" stroke="${C.sun}" stroke-width="4" stroke-linecap="round">
      <path d="M0 -114 V-130 M-34 -104 L-46 -116 M34 -104 L46 -116 M-44 -70 H-60 M44 -70 H60"/></g>
    <rect x="-114" y="-264" width="16" height="234" fill="${C.sun}" ${st(2.5)}/>
    <path d="${zig}" fill="none" stroke="${C.ink}" stroke-width="2"/>
    <rect x="-136" y="-270" width="292" height="14" fill="${C.sun}" ${st(2.5)}/>
    <path d="${jib}" fill="none" stroke="${C.ink}" stroke-width="1.6"/>
    <rect x="-154" y="-268" width="26" height="24" rx="2" fill="${C.ink2}" ${st(2.5)}/>
    <rect x="-122" y="-252" width="30" height="22" rx="3" fill="${C.white}" ${st(2.5)}/>
    <rect x="-116" y="-247" width="12" height="10" rx="2" fill="${C.glass}" stroke="${C.ink}" stroke-width="1.6"/>
    <g class="b-crate">
      <path d="M60 -258 V-190" stroke="${C.ink}" stroke-width="2"/>
      <path d="M60 -190 l-16 6 M60 -190 l16 6" stroke="${C.ink}" stroke-width="2"/>
      <rect x="38" y="-186" width="44" height="38" rx="4" fill="${C.coral}" ${st(2.5)}/>
      ${label(60, -158, 26, '?', { fill: C.white })}
    </g>
    <rect class="b-interior" x="-22" y="-98" width="44" height="68" fill="${C.glow}"/>
    <g class="b-door"><rect x="-22" y="-98" width="44" height="68" fill="${C.aquaMid}" ${st(2.5)}/>
      <circle cx="13" cy="-62" r="2.6" fill="${C.sun}" ${st(1.5)}/></g>
    <rect x="-26" y="-102" width="52" height="72" fill="none" stroke="${C.ink}" stroke-width="4.5" stroke-linejoin="round"/>
    <rect x="60" y="-60" width="5" height="46" fill="${C.wood}" ${st(2)}/>
    <rect x="152" y="-60" width="5" height="46" fill="${C.wood}" ${st(2)}/>
    <rect x="48" y="-100" width="122" height="48" rx="7" fill="${C.white}" ${st(2.5)}/>
    ${label(109, -84, 9, 'NEXT CHAPTER', { ls: 1.6, body: true, weight: 800, fill: C.coralDeep })}
    ${label(109, -64, 15, 'Your team here?')}
    ${cone(-150, 6)}${cone(176, 8)}`;
  }

  function cone(x, y) {
    return `<g transform="translate(${x} ${y})"><rect x="-12" y="-4" width="24" height="5" rx="2" fill="${C.ink2}"/>
      <path d="M-8 -4 L-2 -28 L2 -28 L8 -4 Z" fill="${C.coral}" ${st(2)}/>
      <path d="M-5.5 -13 H5.5" stroke="#fff" stroke-width="3"/></g>`;
  }

  const BUILDINGS = {
    home: { w: 260, top: -236, draw: home },
    visitHealth: { w: 290, top: -218, draw: visitHealth },
    interviewKickstart: { w: 284, top: -306, draw: interviewKickstart },
    affixious: { w: 280, top: -230, draw: affixious },
    future: { w: 340, top: -272, draw: future }
  };

  function marker() {
    return `<path d="M-15 -44 h30 a7 7 0 0 1 7 7 v16 a7 7 0 0 1 -7 7 h-8 l-7 11 l-7 -11 h-8 a7 7 0 0 1 -7 -7 v-16 a7 7 0 0 1 7 -7 z" fill="${C.coral}" ${st(3)}/>
      <path d="M-7 -29 l5 5 l10 -10" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  /* -------------------------------------------------------------- Character
     Feet at (0,0), ~92 units tall. Three views; the side view faces right and
     is mirrored for left. Leg and arm groups are animated from CSS. */

  // Inspired by Shubhangi: long dark wavy hair, sunglasses on her head, a white
  // embroidered sleeveless dress, a cream tote and white slides with blue straps.
  const SLIDE = '#5BB4E0';
  const legs = () => {
    const leg = (cls, x) => `<g class="c-leg ${cls}"><rect x="${x}" y="-28" width="7" height="24" rx="3" fill="${C.skin}" ${st(2)}/>
        <ellipse cx="${x + 3.5}" cy="-3.5" rx="6" ry="3.8" fill="${C.white}" ${st(2)}/>
        <path d="M${x - 0.5} -5.5 Q${x + 3.5} -9 ${x + 7.5} -5.5" fill="none" stroke="${SLIDE}" stroke-width="2.4" stroke-linecap="round"/></g>`;
    return leg('c-leg-l', -9) + leg('c-leg-r', 2);
  };
  const arms = `<g class="c-arm c-arm-l"><rect x="-19" y="-47" width="7" height="19" rx="3.5" fill="${C.skin}" ${st(2)}/>
      <rect x="-19" y="-33" width="7" height="2.6" fill="${C.sun}" stroke="${C.ink}" stroke-width="1"/>
      <circle cx="-15.5" cy="-27" r="3.4" fill="${C.skin}" ${st(1.8)}/></g>
    <g class="c-arm c-arm-r"><rect x="12" y="-47" width="7" height="19" rx="3.5" fill="${C.skin}" ${st(2)}/>
      <rect x="12" y="-33" width="7" height="3.4" rx="1" fill="${C.wood}" stroke="${C.ink}" stroke-width="1"/>
      <circle cx="15.5" cy="-27" r="3.4" fill="${C.skin}" ${st(1.8)}/></g>`;
  // Sleeveless A-line dress with a coral / blue / pink embroidered hem.
  const dressBody = (side) => {
    const w = side ? 10 : 12, hw = side ? 12 : 15;
    const d = `M${-w} -49 Q0 -53 ${w} -49 L${hw} -27 Q0 -23 ${-hw} -27 Z`;
    const dots = side
      ? [[-6, -30.5, C.coral], [0, -29.5, SLIDE], [6, -30.5, '#E7739A']]
      : [[-9, -30.5, C.coral], [-3, -29.5, SLIDE], [3, -29.5, '#E7739A'], [9, -30.5, C.coral]];
    return `<path d="${d}" fill="${C.dress}" ${st(2)}/>
      <path d="M${-hw + 0.6} -28.5 Q0 -24.5 ${hw - 0.6} -28.5" fill="none" stroke="#C85A78" stroke-width="2.2" stroke-dasharray="3 1.8"/>
      ${dots.map(([x, y, c]) => `<circle cx="${x}" cy="${y - 3}" r="1.7" fill="${c}"/>`).join('')}
      <path d="M${-w + 2} -42 Q${-w} -34 ${-hw + 3} -29" fill="none" stroke="${C.cream2}" stroke-width="1.6" stroke-linecap="round"/>`;
  };
  const sunglasses = (x, y, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="-9" y="-2.6" width="7.6" height="5.2" rx="2.2" fill="#6F86B3" stroke="${C.ink}" stroke-width="1.4"/>
      <rect x="1.4" y="-2.6" width="7.6" height="5.2" rx="2.2" fill="#6F86B3" stroke="${C.ink}" stroke-width="1.4"/>
      <path d="M-1.6 -0.6 H1.8" stroke="${C.ink}" stroke-width="1.4"/>
      <path d="M-7.5 -1.2 L-5 -1.2 M3 -1.2 L5.5 -1.2" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".6"/></g>`;
  // Long wavy hair falling past the shoulders.
  const hairLong = 'M-17 -67 C-20 -56 -20 -46 -17 -38 Q-14 -34 -11 -37 Q-8 -33 -4 -37 Q0 -33 4 -37 Q8 -33 11 -37 Q14 -34 17 -38 C20 -46 20 -56 17 -67 C16 -82 8 -85 0 -85 C-8 -85 -16 -82 -17 -67 Z';
  const tote = (x) => `<path d="M${x + 2} -46 Q${x - 6} -50 ${x + 3} -52" fill="none" stroke="${C.tote}" stroke-width="0"/>
      <rect x="${x}" y="-36" width="11" height="13" rx="2.5" fill="${C.tote}" ${st(2)}/>
      <path d="M${x + 3} -38 Q${x + 6.5} -43 ${x + 10} -38" fill="none" stroke="${C.woodDark}" stroke-width="1.6"/>`;

  function viewFront() {
    return `<g class="view view-front">
      <g class="c-legs">${legs()}</g>
      <g class="c-upper">
        <path d="${hairLong}" fill="${C.hair}" ${st(2)}/>
        <rect x="-3" y="-55" width="6" height="8" fill="${C.skinShade}"/>
        ${arms}
        ${dressBody(false)}
        <path d="M-5 -49.5 Q0 -45.5 5 -49.5" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>
        <path d="M10 -49 L-14 -33" stroke="${C.tote}" stroke-width="2.4" stroke-linecap="round"/>
        ${tote(-23)}
        <circle cx="0" cy="-67" r="14.5" fill="${C.skin}" ${st(2)}/>
        <path d="M-14.5 -67 C-15.5 -79 -7 -84 0 -84 C8 -84 15.5 -79 14.5 -67 C12 -72 8 -76 3 -77 C0 -73 -9 -73 -14.5 -67 Z" fill="${C.hair}" ${st(2)}/>
        <path d="M-15 -66 C-17 -58 -17 -50 -14 -44 M15 -66 C17 -58 17 -50 14 -44" fill="none" stroke="${C.hair}" stroke-width="5" stroke-linecap="round"/>
        <path d="M-12 -62 Q-14 -54 -11 -46 M12 -62 Q14 -54 11 -46" fill="none" stroke="${C.hairHi}" stroke-width="1.6" stroke-linecap="round"/>
        ${sunglasses(0, -82, -4)}
        <path d="M-8.5 -69.5 Q-5 -71 -1.8 -69.8 M1.8 -69.8 Q5 -71 8.5 -69.5" fill="none" stroke="${C.hair}" stroke-width="1.5" stroke-linecap="round"/>
        <ellipse cx="-5" cy="-64.5" rx="1.6" ry="2.1" fill="${C.ink}"/>
        <ellipse cx="5" cy="-64.5" rx="1.6" ry="2.1" fill="${C.ink}"/>
        <circle cx="-8.5" cy="-59.5" r="2.6" fill="${C.coral}" opacity=".4"/>
        <circle cx="8.5" cy="-59.5" r="2.6" fill="${C.coral}" opacity=".4"/>
        <path d="M-3.4 -58.6 Q0 -55.6 3.4 -58.6" fill="none" stroke="${C.ink}" stroke-width="1.7" stroke-linecap="round"/>
      </g></g>`;
  }

  function viewBack() {
    return `<g class="view view-back">
      <g class="c-legs">${legs()}</g>
      <g class="c-upper">
        ${arms}
        ${dressBody(false)}
        <path d="M-10 -49 L14 -33" stroke="${C.tote}" stroke-width="2.4" stroke-linecap="round"/>
        ${tote(12)}
        <circle cx="0" cy="-67" r="14.5" fill="${C.skin}" ${st(2)}/>
        <path d="${hairLong}" fill="${C.hair}" ${st(2)}/>
        <path d="M-9 -77 Q0 -81 9 -77 M-11 -62 Q-12 -52 -9 -43 M0 -70 Q2 -55 0 -42 M11 -62 Q12 -52 9 -43" fill="none" stroke="${C.hairHi}" stroke-width="2" stroke-linecap="round"/>
        ${sunglasses(0, -82, 0)}
      </g></g>`;
  }

  function viewSide() {
    const leg = (cls) => `<g class="c-leg ${cls}"><rect x="-4" y="-28" width="8" height="24" rx="3" fill="${C.skin}" ${st(2)}/>
      <ellipse cx="2" cy="-3.5" rx="6.5" ry="3.8" fill="${C.white}" ${st(2)}/>
      <path d="M-1.5 -5.5 Q2 -9 5.5 -6" fill="none" stroke="${SLIDE}" stroke-width="2.4" stroke-linecap="round"/></g>`;
    return `<g class="view view-side">
      <g class="c-legs">${leg('c-leg-l')}${leg('c-leg-r')}</g>
      <g class="c-upper">
        <path d="M-6 -75 C-20 -70 -22 -52 -18 -38 Q-14 -34 -11 -37 Q-8 -33 -4 -38 L2 -50 Z" fill="${C.hair}" ${st(2)}/>
        <rect x="-17" y="-36" width="11" height="13" rx="2.5" fill="${C.tote}" ${st(2)}/>
        <path d="M-16 -38 Q-13 -43 -10 -38" fill="none" stroke="${C.woodDark}" stroke-width="1.6"/>
        <rect x="-2" y="-55" width="6" height="8" fill="${C.skinShade}"/>
        <path d="M-9 -49 Q0 -52 9 -49 L12 -27 Q0 -23 -12 -27 Z" fill="${C.dress}" ${st(2)}/>
        <path d="M-11.4 -28.5 Q0 -24.5 11.4 -28.5" fill="none" stroke="#C85A78" stroke-width="2.2" stroke-dasharray="3 1.8"/>
        <circle cx="-5" cy="-33.5" r="1.7" fill="${C.coral}"/><circle cx="1" cy="-32.5" r="1.7" fill="${SLIDE}"/><circle cx="7" cy="-33.5" r="1.7" fill="#E7739A"/>
        <circle cx="1" cy="-67" r="14.5" fill="${C.skin}" ${st(2)}/>
        <path d="M15 -70 C15 -80 9 -84 0 -84 C-10 -84 -16 -78 -16 -67 C-16 -60 -14 -56 -11 -52 L-2 -58 C3 -62 6 -66 7 -72 C10 -70 13 -70 15 -70 Z" fill="${C.hair}" ${st(2)}/>
        <path d="M-12 -66 Q-14 -58 -11 -52" fill="none" stroke="${C.hairHi}" stroke-width="1.6" stroke-linecap="round"/>
        ${sunglasses(-3, -82, -12)}
        <ellipse cx="9" cy="-64" rx="1.5" ry="2.1" fill="${C.ink}"/>
        <path d="M5.5 -69 Q8.5 -70.5 11.5 -69" fill="none" stroke="${C.hair}" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="10" cy="-59" r="2.4" fill="${C.coral}" opacity=".4"/>
        <path d="M10.5 -57.5 Q12.5 -56.4 14 -58" fill="none" stroke="${C.ink}" stroke-width="1.5" stroke-linecap="round"/>
        <g class="c-arm c-arm-r"><rect x="-3.5" y="-47" width="7" height="19" rx="3.5" fill="${C.skin}" ${st(2)}/>
          <rect x="-3.5" y="-33" width="7" height="3.4" rx="1" fill="${C.wood}" stroke="${C.ink}" stroke-width="1"/>
          <circle cx="0" cy="-27" r="3.4" fill="${C.skin}" ${st(1.8)}/></g>
      </g></g>`;
  }

  function character() {
    return `<ellipse class="c-shadow" cx="0" cy="0" rx="17" ry="5" fill="${C.ink}" opacity=".2"/>
      <g class="c-body">${viewFront()}${viewBack()}${viewSide()}</g>`;
  }

  /* ------------------------------------------------------------------ Props */

  function tree(v) {
    const fill = v === 'blossom' ? C.blossom : v === 'dark' ? C.leafDeep : C.leaf;
    const hi = v === 'blossom' ? '#FCD0C8' : v === 'dark' ? C.leaf : C.leafLight;
    const dots = v === 'blossom' ? `<circle cx="12" cy="-50" r="3" fill="${C.white}"/><circle cx="-14" cy="-44" r="3" fill="${C.white}"/><circle cx="2" cy="-74" r="3" fill="${C.white}"/>` :
      `<circle cx="14" cy="-48" r="3" fill="${C.coral}"/><circle cx="-8" cy="-40" r="3" fill="${C.coral}"/>`;
    return `<ellipse cx="8" cy="2" rx="30" ry="9" fill="${C.ink}" opacity=".13"/>
      <rect x="-5" y="-30" width="10" height="32" rx="3" fill="${C.wood}" ${st(2.5)}/>
      <circle cx="0" cy="-58" r="32" fill="${fill}" ${st()}/>
      <circle cx="-11" cy="-69" r="12" fill="${hi}"/>
      ${v === 'plain' ? '' : dots}`;
  }

  function pine() {
    return `<ellipse cx="8" cy="2" rx="24" ry="8" fill="${C.ink}" opacity=".13"/>
      <rect x="-4" y="-18" width="8" height="20" fill="${C.woodDark}" ${st(2.5)}/>
      <path d="M-28 -16 L0 -56 L28 -16 Z" fill="${C.leafDeep}" ${st()}/>
      <path d="M-22 -40 L0 -78 L22 -40 Z" fill="${C.leafDeep}" ${st()}/>
      <path d="M-15 -62 L0 -96 L15 -62 Z" fill="${C.leafDeep}" ${st()}/>
      <path d="M-14 -24 L-4 -40 M-10 -48 L-2 -62" stroke="${C.leaf}" stroke-width="3" stroke-linecap="round"/>`;
  }

  function bush() {
    return `<ellipse cx="4" cy="2" rx="28" ry="7" fill="${C.ink}" opacity=".12"/>
      <circle cx="-13" cy="-11" r="12" fill="${C.leafDeep}" ${st(2.5)}/>
      <circle cx="13" cy="-11" r="12" fill="${C.leafDeep}" ${st(2.5)}/>
      <circle cx="0" cy="-17" r="15" fill="${C.leaf}" ${st(2.5)}/>
      <circle cx="-5" cy="-23" r="5" fill="${C.leafLight}"/>`;
  }

  function lamp() {
    return `<circle class="d-glow" cx="0" cy="-78" r="26" fill="${C.sun}" opacity=".2"/>
      <ellipse cx="5" cy="2" rx="12" ry="4" fill="${C.ink}" opacity=".15"/>
      <rect x="-7" y="-6" width="14" height="7" rx="2" fill="${C.ink2}"/>
      <rect x="-2.5" y="-70" width="5" height="66" fill="${C.ink2}"/>
      <rect x="-9" y="-88" width="18" height="18" rx="3" fill="${C.sun}" ${st(2.5)}/>
      <path d="M-12 -88 L0 -98 L12 -88 Z" fill="${C.ink2}" ${st(2.5)}/>`;
  }

  function bench() {
    return `<ellipse cx="4" cy="2" rx="34" ry="6" fill="${C.ink}" opacity=".12"/>
      <rect x="-26" y="-14" width="4" height="15" fill="${C.ink2}"/><rect x="22" y="-14" width="4" height="15" fill="${C.ink2}"/>
      <rect x="-30" y="-38" width="60" height="10" rx="3" fill="${C.wood}" ${st(2.5)}/>
      <rect x="-30" y="-20" width="60" height="9" rx="3" fill="${C.woodLight}" ${st(2.5)}/>
      <rect x="-26" y="-28" width="4" height="8" fill="${C.ink2}"/><rect x="22" y="-28" width="4" height="8" fill="${C.ink2}"/>`;
  }

  function signboard() {
    return `<ellipse cx="6" cy="3" rx="96" ry="10" fill="${C.ink}" opacity=".12"/>
      <rect x="-80" y="-72" width="9" height="74" fill="${C.wood}" ${st(2.5)}/>
      <rect x="71" y="-72" width="9" height="74" fill="${C.wood}" ${st(2.5)}/>
      <rect x="-114" y="-166" width="228" height="100" rx="10" fill="${C.woodLight}" ${st()}/>
      <rect x="-106" y="-158" width="212" height="84" rx="6" fill="none" stroke="${C.wood}" stroke-width="2"/>
      ${label(0, -136, 12, 'HOW TO EXPLORE', { ls: 2.2, body: true, weight: 800 })}
      ${label(0, -116, 12.5, 'Click or tap a building', { body: true, weight: 600 })}
      ${label(0, -99, 12.5, 'Keyboard: Tab, then Enter', { body: true, weight: 600 })}
      ${label(0, -82, 12.5, 'Press D for the directory', { body: true, weight: 600 })}`;
  }

  function flowers(seed) {
    const cols = [C.coral, C.white, C.sun, C.coralLight];
    let s = '';
    const pts = [[0, 0], [9, -4], [-8, -5], [4, 7], [-5, 6], [13, 5]];
    pts.forEach(([x, y], i) => {
      const c = cols[(i + seed) % cols.length];
      s += `<circle cx="${x}" cy="${y}" r="3.6" fill="${c}" stroke="${C.ink}" stroke-width="1.3"/>`;
    });
    return `<g>${s}</g>`;
  }

  const rock = () => `<path d="M-16 0 C-18 -10 -8 -16 0 -15 C10 -16 18 -9 16 0 Z" fill="${C.stone2}" ${st(2.5)}/>
    <path d="M-6 -10 Q0 -12 5 -10" stroke="#fff" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>`;

  const tuft = () => `<path d="M-6 0 L-3 -8 L0 0 L3 -10 L6 0" fill="none" stroke="${C.leafDeep}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>`;

  function pond(rx, ry) {
    return `<ellipse cx="0" cy="0" rx="${rx + 8}" ry="${ry + 6}" fill="${C.sandEdge}" opacity=".6"/>
      <ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="${C.aquaMid}" ${st()}/>
      <ellipse cx="-6" cy="-4" rx="${rx * 0.72}" ry="${ry * 0.55}" fill="${C.aqua}"/>
      <path d="M${-rx * 0.4} ${-ry * 0.1} q8 -4 16 0 M${rx * 0.1} ${ry * 0.3} q8 -4 16 0" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>
      <circle cx="${rx * 0.55}" cy="${ry * 0.15}" r="9" fill="${C.leaf}" ${st(2)}/>
      <circle cx="${-rx * 0.6}" cy="${ry * 0.2}" r="7" fill="${C.leaf}" ${st(2)}/>
      <circle cx="${rx * 0.55 + 3}" cy="${ry * 0.15 - 3}" r="3" fill="${C.coralLight}"/>
      <g class="d-duck" transform="translate(${-rx * 0.1} ${-ry * 0.25})"><g class="d-duck-inner">
        <ellipse cx="0" cy="0" rx="12" ry="7.5" fill="${C.white}" ${st(2)}/>
        <circle cx="8" cy="-8" r="5.5" fill="${C.white}" ${st(2)}/>
        <path d="M13 -8 l6 1.5 l-6 2 z" fill="${C.sun}" ${st(1.5)}/>
        <circle cx="9.5" cy="-9" r="1.2" fill="${C.ink}"/></g></g>`;
  }

  function plaza(r) {
    let spokes = '';
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      spokes += `M${(Math.cos(a) * r * 0.42).toFixed(1)} ${(Math.sin(a) * r * 0.42 * 0.6).toFixed(1)} L${(Math.cos(a) * r * 0.86).toFixed(1)} ${(Math.sin(a) * r * 0.86 * 0.6).toFixed(1)} `;
    }
    return `<ellipse cx="0" cy="0" rx="${r + 8}" ry="${(r + 8) * 0.6}" fill="${C.sandEdge}"/>
      <ellipse cx="0" cy="0" rx="${r}" ry="${r * 0.6}" fill="${C.stone}" stroke="${C.stone2}" stroke-width="3"/>
      <path d="${spokes}" stroke="${C.stone2}" stroke-width="3"/>
      <ellipse cx="0" cy="0" rx="${r * 0.4}" ry="${r * 0.24}" fill="${C.cream2}" stroke="${C.stone2}" stroke-width="3"/>
      <path d="M0 ${-r * 0.17} L${r * 0.07} 0 L0 ${r * 0.17} L${-r * 0.07} 0 Z M${-r * 0.3} 0 L0 ${-r * 0.05} L${r * 0.3} 0 L0 ${r * 0.05} Z" fill="${C.coral}" opacity=".8"/>`;
  }

  function butterfly() {
    return `<g class="d-wing"><ellipse cx="-4" cy="0" rx="5" ry="3.5" fill="${C.coral}" stroke="${C.ink}" stroke-width="1.2"/>
      <ellipse cx="4" cy="0" rx="5" ry="3.5" fill="${C.coral}" stroke="${C.ink}" stroke-width="1.2"/></g>
      <rect x="-.8" y="-3" width="1.6" height="6" rx=".8" fill="${C.ink}"/>`;
  }

  window.Art = {
    C,
    building: (type) => BUILDINGS[type].draw(),
    meta: (type) => ({ w: BUILDINGS[type].w, top: BUILDINGS[type].top }),
    marker, character, viewFront,
    tree, pine, bush, lamp, bench, signboard, flowers, rock, tuft, pond, plaza, butterfly, cone
  };
})();
