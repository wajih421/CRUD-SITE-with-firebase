import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useFirebase } from "../context/Firebase";

function StudentForm({
  selectedStudent,
  setSelectedStudent,
}) {
  const firebase = useFirebase();

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      age: "",
      department: "",
      semester: "",
      cgpa: "",
    },
  });

  useEffect(() => {
    if (selectedStudent) {
      reset({
        name: selectedStudent.name,
        age: selectedStudent.age,
        department: selectedStudent.department,
        semester: selectedStudent.semester,
        cgpa: selectedStudent.cgpa,
      });
    } else {
      reset({
        name: "",
        age: "",
        department: "",
        semester: "",
        cgpa: "",
      });
    }
  }, [selectedStudent, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (selectedStudent) {
        await firebase.updateStudent(selectedStudent.id, data);

        alert("Student Updated Successfully");

        setSelectedStudent(null);
      } else {
        await firebase.addStudent(data);

        alert("Student Added Successfully");
      }

      reset();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="student-form" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        rules={{ required: "Name is required" }}
        render={({ field }) => (
          <input {...field} placeholder="Student Name" />
        )}
      />

      {errors.name && <p>{errors.name.message}</p>}

      <Controller
        name="age"
        control={control}
        rules={{
          required: "Age is required",
          min: { value: 16, message: "Minimum age is 16" },
          max: { value: 60, message: "Maximum age is 60" },
        }}
        render={({ field }) => (
          <input {...field} type="number" placeholder="Age" />
        )}
      />

      {errors.age && <p>{errors.age.message}</p>}

      <Controller
        name="department"
        control={control}
        rules={{ required: "Department is required" }}
        render={({ field }) => (
          <input {...field} placeholder="Department" />
        )}
      />

      {errors.department && <p>{errors.department.message}</p>}

      <Controller
        name="semester"
        control={control}
        rules={{
          required: "Semester is required",
          min: { value: 1, message: "Minimum semester is 1" },
          max: { value: 8, message: "Maximum semester is 8" },
        }}
        render={({ field }) => (
          <input {...field} type="number" placeholder="Semester" />
        )}
      />

      {errors.semester && <p>{errors.semester.message}</p>}

      <Controller
        name="cgpa"
        control={control}
        rules={{
          required: "CGPA is required",
          min: { value: 0, message: "Minimum CGPA is 0" },
          max: { value: 4, message: "Maximum CGPA is 4" },
        }}
        render={({ field }) => (
          <input
            {...field}
            type="number"
            step="0.01"
            placeholder="CGPA"
          />
        )}
      />

      {errors.cgpa && <p>{errors.cgpa.message}</p>}

      <button type="submit" disabled={loading}>
        {loading
          ? "Please Wait..."
          : selectedStudent
          ? "Update Student"
          : "Add Student"}
      </button>

      {selectedStudent && (
        <button
          type="button"
          onClick={() => {
            setSelectedStudent(null);
            reset();
          }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default StudentForm;