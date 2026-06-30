import { useState } from "react";

import { useFirebase } from "../context/Firebase";

import StudentForm from "../components/StudentForm";
import StudentList from "../components/StudentList";

function Home() {
  const firebase = useFirebase();

  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleLogout = async () => {
    try {
      await firebase.logout();

      alert("Logged Out Successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1> Student CRUD</h1>

        <button onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className="student-form-container">
        <h2>
          {selectedStudent
            ? "Update Student"
            : "Add Student"}
        </h2>

        <StudentForm
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
        />
      </div>

      <div className="student-list-container">
        <h2>Students</h2>

        <StudentList
          setSelectedStudent={setSelectedStudent}
        />
      </div>
    </div>
  );
}

export default Home;