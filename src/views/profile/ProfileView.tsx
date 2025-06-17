// importamos el hook de auth para la autentificacion
import { useAuth } from "@/hooks/useAuth";
// importamos nuestro componente de formulario de perfil
import ProfileForm from "./ProfileForm";

export default function ProfileView() {
  const { data, isLoading } = useAuth();

  if (isLoading) return <p>Cargando...</p>;

  if (data) return <ProfileForm data={data} />;
}
