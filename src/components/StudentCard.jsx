import { useFirebase } from "../context/Firebase";

function StudentCard({ student, setSelectedStudent }) {
  const firebase = useFirebase();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmDelete) return;

    try {
      await firebase.deleteStudent(student.id);
      alert("Student Deleted Successfully");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="student-card">
      <h2>{student.name}</h2>

      <p>
        <strong>Age:</strong> {student.age}
      </p>

      <p>
        <strong>Department:</strong> {student.department}
      </p>

      <p>
        <strong>Semester:</strong> {student.semester}
      </p>

      <p>
        <strong>CGPA:</strong> {student.cgpa}
      </p>

      <div className="student-card-buttons">
        <button
          onClick={() => setSelectedStudent(student)}
        >
          Edit
        </button>

        <button onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default StudentCard;