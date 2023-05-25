import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      meta: {
        authRequired: {
          roles: ['admin'],
        }
      }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/TasksView.vue'),
      meta: {
        authRequired: {
          roles: ['admin', 'yönetici', 'kullanıcı'],
        }
      }
    },
    {
      path: '/departments',
      name: 'departments',
      component: () => import('../views/DepartmentsView.vue'),
      meta: {
        authRequired: {
          roles: ['admin'],
        }
      }
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
      meta: {
        authRequired: {
          roles: ['admin'],
        }
      }
    },
    {
      path: '/conversations/:taskId',
      name: 'conversations',
      component: () => import('../views/ConversationsView.vue'),
      meta: {
        authRequired: {
          roles: ['admin', 'yönetici', 'kullanıcı'],
        }
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authRequired = to.meta.authRequired;
  if (authRequired) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (authRequired.roles.includes(user.role.name)) {
        next();
      }
      else {
        next({ name: 'tasks' });
      }
    }
    else {
      next({ name: 'login' });
    }
  }
  else {
    next();
  }
});


export default router
