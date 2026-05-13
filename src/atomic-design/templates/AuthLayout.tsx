import { Outlet } from "react-router-dom";
import { Logo } from "@/atomic-design/atoms/Logo";

export const AuthLayout = () => (
  <div className="relative grid min-h-screen w-full place-items-center overflow-hidden px-4 py-10">
    {/* radial gradient bg */}
    <div className="pointer-events-none absolute inset-0 bg-gradient-radial" />
    <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

    <div className="relative z-10 w-full max-w-md animate-fade-in-up">
      <div className="mb-8 flex justify-center">
        <Logo size="lg" />
      </div>
      <div className="glass-strong rounded-2xl p-6 shadow-elegant sm:p-8">
        <Outlet />
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Concessio · El CRM que maneja tu concesionario.
      </p>
    </div>
  </div>
);
