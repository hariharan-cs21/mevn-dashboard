import { createRouter, createWebHistory } from 'vue-router';

import Login from './components/Login.vue';
import StudentData from './components/StudentData.vue';
import Performance from './components/Performance.vue';
import Register from './components/Register.vue';
import StudentDashboard from './components/StudentDashboard.vue';
import AddPerformance from './components/AddPerformance.vue';

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
    {
        name: "studentperformance",
        path: '/performance/:studentId',
        component: StudentDashboard,
        props: true
    },
    {
        path: '/addPerformance',
        name: 'AddPerformance',
        component: AddPerformance,
        props: true
    },



];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
