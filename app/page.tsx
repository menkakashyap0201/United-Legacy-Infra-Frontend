import { redirect } from "next/navigation";

/** "/" always opens the home page. */
export default function RootPage() {
  redirect("/home");
}