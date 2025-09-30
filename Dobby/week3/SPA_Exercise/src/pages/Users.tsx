import React from "react";
import Link from "../Link";

export default function Users() {
  const fakeUsers = [
    { id: 1, name: "Ada" },
    { id: 2, name: "Linus" },
  ];
  return (
    <>
      <h1>Users</h1>
      <ul>
        {fakeUsers.map((u) => (
          <li key={u.id}>
            <Link to={`/users/${u.id}`}>{u.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
