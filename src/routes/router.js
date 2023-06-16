import Registration from './registration';
import Root from './root';
import Login from './login';
import Create_Profile from './create_profile';
import Job_List from './job_list';
import { createBrowserRouter, } from "react-router-dom";
import ErrorPage from "../error-page";
import Add_Job from './add_job';
import Job from './job';
import ForgotPassword from './forgot_passord';
import Postings from './postings';
import Applications from './applications';



export const router = createBrowserRouter([
      {
            path: "/",
            element: <Root />,
            errorElement: <ErrorPage />,
      },
      {
            path: "/register",
            element: <Registration />,
            errorElement: <ErrorPage />,
      },
      {
            path: "/login",
            element: <Login />,
            errorElement: <ErrorPage />,

      },
      {
            path: "/forgot-password",
            element: <ForgotPassword />,
            errorElement: <ErrorPage />
      },
      {
            path: "/create-profile",
            element: <Create_Profile />
      },
      {
            path: "/job-list",
            element: <Job_List />,
            errorElement: <ErrorPage />,
      },
      {
            path: "/add-job",
            element: <Add_Job />,
            errorElement: <ErrorPage />,
      },
      {
            path: "/job/:jobId",
            element: <Job />,
            errorElement: <ErrorPage />,
      },
      {
            path: "/my-applications",
            element: <Applications />,
            errorElement: <ErrorPage />,
      },
      {
            path: "my-postings",
            element: <Postings />,
            errorElement: <ErrorPage />,
      },
]);