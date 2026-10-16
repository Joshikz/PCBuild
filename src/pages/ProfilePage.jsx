import { useOutletContext } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useOutletContext();

  return (
    <main>
      <h1>Your Profile</h1>
      {user?.avatarUrl && (
        <img
          src={user.avatarUrl}
          alt={user.name ? `${user.name}'s avatar` : "Profile avatar"}
          style={{
            width: "96px",
            height: "96px",
            objectFit: "cover",
          }}
        />
      )}
      {user?.name && <p>Name: {user.name}</p>}
      {user?.email && <p>Email: {user.email}</p>}
      {user?.role && <p>Role: {user.role}</p>}
    </main>
  );
}
