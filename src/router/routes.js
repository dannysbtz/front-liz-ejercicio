const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: { name: 'generar-plan' } },
      { path: 'second', component: () => import('@/pages/SecondPage.vue') },
      {
        path: 'clientes',
        name: 'clientes',
        component: () => import('@/pages/ClientesPage.vue'),
      },
      {
        path: 'ejercicios',
        name: 'ejercicios',
        component: () => import('@/pages/EjerciciosPage.vue'),
      },
      {
        path: 'generar-rutinas',
        name: 'generar-rutinas',
        component: () => import('@/pages/GenerarRutinasPage.vue'),
      },
      {
        path: 'generar-plan',
        name: 'generar-plan',
        component: () => import('@/pages/GenerarPlanPage.vue'),
      },
      {
        path: 'generar-plan/nuevo',
        name: 'generar-plan-nuevo',
        component: () => import('@/pages/GenerarPlanFormPage.vue'),
      },
      {
        path: 'generar-plan/:id/editar',
        name: 'generar-plan-editar',
        component: () => import('@/pages/GenerarPlanFormPage.vue'),
      },
      {
        path: 'generar-plan/:id',
        name: 'generar-plan-ver',
        component: () => import('@/pages/GenerarPlanVerPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes
