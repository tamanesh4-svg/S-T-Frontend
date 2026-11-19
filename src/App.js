import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";

// Teacher
import TeacherLogin from "./Pages/auth/TeacherLogin";
import TeacherRegister from "./Pages/auth/TeacherRegister";
import TeacherLayout from "./Pages/teacher/TeacherLayout";
import TeacherHome from "./Pages/teacher/TeacherHome";
import AddClass from "./Pages/teacher/AddClass";
import Results from "./Pages/teacher/Results";
import ExistingClasses from "./Pages/teacher/ExistingClasses";
import Attendance from "./Pages/teacher/Attendance";
import PublishNotice from "./Pages/teacher/PublishNotice";
import ClassStudents from "./Pages/teacher/ClassStudents";
import RoutineManager from "./Pages/teacher/RoutineManager";

// Student
import StudentLogin from "./Pages/auth/StudentLogin";
import StudentRegister from "./Pages/auth/StudentRegister";
import StudentHome from "./Pages/student/StudentHome";
import ViewResults from "./Pages/student/ViewResults";
import StudentAttendance from "./Pages/student/StudentAttendance";
import StudentNotices from "./Pages/student/StudentNotices";
import StudentJoinClass from "./Pages/student/StudentJoinClass";
import StudentRoutine from "./Pages/student/StudenRoutine";
import StudentLayout from "./Pages/student/StudentLayout";

// Other
import FeaturePending from "./Pages/FeaturePending";

// Route Protection
import ProtectRoute from "./Components/ProtectRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route
          path="/teacher/register"
          element={<TeacherRegister />}
        />

        <Route
          path="/teacher/login"
          element={<TeacherLogin />}
        />

        <Route
          path="/student/login"
          element={<StudentLogin />}
        />

        <Route
          path="/student/register"
          element={<StudentRegister />}
        />


        {/* ================= TEACHER PROTECTED ROUTES ================= */}

        <Route
          path="/teacher/home"
          element={
            <ProtectRoute allowedRole="teacher">
              <TeacherHome />
            </ProtectRoute>
          }
        />

        <Route
          path="/teacher/prediction"
          element={
            <ProtectRoute allowedRole="teacher">
              <FeaturePending title="Performance Prediction" />
            </ProtectRoute>
          }
        />

        <Route
          path="/teacher/routine"
          element={
            <ProtectRoute allowedRole="teacher">
              <RoutineManager />
            </ProtectRoute>
          }
        />


        {/* ================= TEACHER LAYOUT ROUTES ================= */}

        <Route
          path="/teacher"
          element={
            <ProtectRoute allowedRole="teacher">
              <TeacherLayout />
            </ProtectRoute>
          }
        >

          <Route path="add-class" element={<AddClass />} />

          <Route path="results" element={<Results />} />

          <Route path="classes" element={<ExistingClasses />} />

          <Route
            path="class/:classId/students"
            element={<ClassStudents />}
          />

          <Route path="attendance" element={<Attendance />} />

          <Route path="publish-notice" element={<PublishNotice />} />

        </Route>


        {/* ================= STUDENT HOME - WITHOUT SIDEBAR ================= */}

        <Route
          path="/student/home"
          element={
            <ProtectRoute allowedRole="student">
              <StudentHome />
            </ProtectRoute>
          }
        />


        {/* ================= STUDENT PROTECTED LAYOUT ================= */}

        <Route
          path="/student"
          element={
            <ProtectRoute allowedRole="student">
              <StudentLayout />
            </ProtectRoute>
          }
        >

          <Route path="join-class" element={<StudentJoinClass />} />

          <Route path="results" element={<ViewResults />} />

          <Route path="attendance" element={<StudentAttendance />} />

          <Route path="notices" element={<StudentNotices />} />

          <Route path="routine" element={<StudentRoutine />} />

          <Route
            path="prediction"
            element={<FeaturePending title="Performance Prediction" />}
          />

          <Route
            path="messages"
            element={<FeaturePending title="Messages" />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;