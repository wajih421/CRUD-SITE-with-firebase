import { useFirebase } from "../context/Firebase";
import StudentCard from "./StudentCard";

function StudentList({ setSelectedStudent }) {
  const firebase = useFirebase();

  if (firebase.students.length === 0) {
    return <h2>No Students Found</h2>;
  }

  return (
    <div className="student-list">
      {firebase.students.map((student) => (
        <StudentCard
          key={student.id}
          student={student}
          setSelectedStudent={setSelectedStudent}
        />
      ))}
    </div>
  );
}

export default StudentList;