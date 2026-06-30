import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useFirebase } from "../context/Firebase";

function Auth() {
  const firebase = useFirebase();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (isLogin) {
        await firebase.loginUserWithEmailAndPassword(
          data.email,
          data.password
        );

        alert("Login Successful");
      } else {
        await firebase.signupUserWithEmailAndPassword(
          data.email,
          data.password
        );

        alert("Account Created Successfully");
      }

      reset();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await firebase.signInWithGoogle();

      alert("Google Login Successful");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Name is required",
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Full Name"
                  />
                )}
              />

              {errors.name && (
                <p className="error">{errors.name.message}</p>
              )}
            </>
          )}

          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid Email",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="Email"
              />
            )}
          />

          {errors.email && (
            <p className="error">{errors.email.message}</p>
          )}

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                placeholder="Password"
              />
            )}
          />

          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}

          {!isLogin && (
            <>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    placeholder="Confirm Password"
                  />
                )}
              />

              {errors.confirmPassword && (
                <p className="error">
                  {errors.confirmPassword.message}
                </p>
              )}
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Please Wait..."
              : isLogin
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Continue with Google
        </button>

        <p>
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <span
            onClick={() => {
              setIsLogin(!isLogin);
              reset();
            }}
            style={{
              cursor: "pointer",
              marginLeft: "6px",
              fontWeight: "bold",
            }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;