import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'vehicles',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'cart',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'vehicle/:type/:id',
    renderMode: RenderMode.Server // Usar Server-side rendering para rutas dinámicas
  },
  {
    path: '**',
    renderMode: RenderMode.Server // Fallback para rutas no especificadas
  }
];
