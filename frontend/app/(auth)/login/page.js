import { loginAction } from "@/actions/auth-action";
import { Login } from "@/components/login";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Login loginAction={loginAction} />
    </div>
  );
}
