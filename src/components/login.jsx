/* eslint-disable no-constant-condition */
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { ConfettiButton } from "./magicui/confetti";
import { BeatLoader } from "react-spinners";
import Error from "./error";
import * as Yup from "Yup";

const Login = () => {
  const [formState, setFormState] = useState({
    isValidForm: false,
    isSubmitting: false,
    errors: [],
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleLogin = async () => {
    setFormState({
      isSubmitting: true,
      isValidForm: false,
      errors: [],
    });
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid Email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });
      await schema.validate(formData, { abortEarly: false });
      setFormState({
        isSubmitting: false,
        isValidForm: true,
        errors: [],
      });
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setFormState({
        isSubmitting: false,
        isValidForm: false,
        errors: newErrors,
      });
    }
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={handleInputChange}
            />
            {formState.errors.email && (
              <Error message={formState.errors.email} />
            )}
          </div>
          <div className="grid gap-2 relative">
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center">
              <Input
                name="password"
                id="password"
                type={passwordVisible ? "text" : "password"}
                required
                placeholder="********"
                className=""
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="-ml-10"
              >
                {passwordVisible ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {formState.errors.password && (
              <Error message={formState.errors.password} />
            )}
          </div>
        </CardContent>
        <CardFooter>
          <ConfettiButton
            className="w-full"
            onClick={handleLogin}
            triggerAnimation={formState.isValidForm}
          >
            {formState.isSubmitting ? (
              <BeatLoader size={10} color="#262626" />
            ) : (
              "Sign In"
            )}
          </ConfettiButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
