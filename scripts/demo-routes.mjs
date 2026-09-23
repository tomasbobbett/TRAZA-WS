import { DEMOS } from './demo-content.mjs';

// One stable address per industry, shared by the catalogue, metadata and link list.
const labels = {
  estetica: 'Estética', odontologia: 'Odontología', gastronomia: 'Gastronomía',
  inmobiliaria: 'Inmobiliaria', profesional: 'Estudio jurídico / profesionales',
  taller: 'Taller mecánico', veterinaria: 'Veterinaria', academia: 'Academia de idiomas',
  hogar: 'Servicios para el hogar', eventos: 'Eventos', alojamiento: 'Alojamiento',
};

export const DEMO_ROUTES = [
  { key: 'gimnasio', label: 'Gimnasio', brand: 'PULSO', source: '/1_basico/index.html', route: '/demo/gimnasio/' },
  ...Object.entries(DEMOS).map(([key, demo]) => ({
    key, label: labels[key], brand: demo.brand,
    source: `/nichos/${key}.html`, route: `/demo/${key}/`,
  })),
];

export const DEMO_PAGES = [
  ...DEMO_ROUTES,
  ...['contacto', 'faqs', 'sedes'].map(key => ({
    source: `/1_basico/pages/${key}.html`, route: `/demo/gimnasio/${key}/`,
  })),
];

export const canonicalRoute = source => DEMO_PAGES.find(page => page.source === source)?.route || source;
