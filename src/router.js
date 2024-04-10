import { createRouter, createWebHistory } from 'vue-router';

import Login from './components/Login.vue';
import StudentData from './components/StudentData.vue';
import Performance from './components/Performance.vue';
import Register from './components/Register.vue';


const routes = [
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/studentData',
        component: StudentData
    },
    {
        path: '/performance',
        component: Performance
    },
    {
        path: '/register',
        component: Register
    },


];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
