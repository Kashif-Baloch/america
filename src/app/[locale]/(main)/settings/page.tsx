import Hero from "@/components/pages/settings/Hero";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const Settings = async ({ params }: {
  params: Promise<{ locale: string }>
}) => {

  const { locale } = await params;

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return redirect({ href: "/login", locale })
  }

  return (
    <>
      {/* <pre className="text-base overflow-clip max-w-[1200px] mx-auto">
        {JSON.stringify(session, null, 2)}
      </pre> */}
      <Hero />;
    </>
  )
};

export default Settings;
