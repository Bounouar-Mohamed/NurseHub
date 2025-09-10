import ProtectedRoute from "@/components/auth/protected-route"
import ProfileForm from "@/components/auth/profile-form"

export default function Page() {
  return (
    <ProtectedRoute>
      <ProfileForm />
    </ProtectedRoute>
  )
} 