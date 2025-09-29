import React from "react";
import { useRouter, useSearchParams } from "../router";

export default function UserDetail() {
  const { params } = useRouter(); // { id }
  const qs = useSearchParams();
  const tab = qs.get("tab") ?? "profile";
  return (
    <>
      <h1>User #{params.id}</h1>
      <p>Active tab: {tab}</p>
    </>
  );
}
