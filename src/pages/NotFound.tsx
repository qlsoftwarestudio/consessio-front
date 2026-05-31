import { Link } from "react-router-dom";
import { Logo } from "@/atomic-design/atoms/Logo";
import { Button } from "@/components/ui/button";

const NotFound = () => {

  return (
    <div className="relative grid min-h-screen place-items-center px-4">
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial" />
      <div className="relative z-10 text-center animate-fade-in-up">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <p className="font-display text-7xl font-bold text-gradient-gold">404</p>
        <h1 className="mt-2 font-display text-2xl font-semibold">Página no encontrada</h1>
        <p className="mt-2 text-sm text-muted-foreground">La ruta que buscás no existe o fue movida.</p>
        <Button asChild className="mt-6 bg-gradient-gold text-primary-foreground shadow-amber">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
