import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CourseDetail from "./pages/CourseDetail";
import StudentDashboard from "./pages/StudentDashboard";
import EducatorDashboard from "./pages/EducatorDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pricing from "./pages/Pricing";

export const routers = [
    {
      path: "/",
      name: 'home',
      element: <Index />,
    },
    {
      path: "/course/:id",
      name: 'course-detail',
      element: <CourseDetail />,
    },
    {
      path: "/dashboard/student",
      name: 'student-dashboard',
      element: <StudentDashboard />,
    },
    {
      path: "/dashboard/educator",
      name: 'educator-dashboard',
      element: <EducatorDashboard />,
    },
    {
      path: "/login",
      name: 'login',
      element: <Login />,
    },
    {
      path: "/signup",
      name: 'signup',
      element: <Signup />,
    },
    {
      path: "/pricing",
      name: 'pricing',
      element: <Pricing />,
    },
    /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
    {
      path: "*",
      name: '404',
      element: <NotFound />,
    },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;