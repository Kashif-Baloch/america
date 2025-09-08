import { redirect } from "next/navigation";

export default function NotFound() {
  // Redirect to the default locale's 404 page
  redirect("/not-found");
}
